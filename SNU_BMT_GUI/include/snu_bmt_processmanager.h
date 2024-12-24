#ifndef SNU_BMT_PROCESSMANAGER_H
#define SNU_BMT_PROCESSMANAGER_H

#include "snu_bmt_interface.h"
#include "logmanager.h"
#include <memory>
#include <string>
#include <QThread>
#include <QTimer>
#include <QProgressBar>
#include "bmt_process_progressbar.h"
using namespace std;

//일반적으로 Template 은 구현부를 header 에서 같이 제공함 (Link하기 용이 하도록함)


template<typename T>
class SNU_BMT_ProcessManager
{
private:

    shared_ptr<bmtProcessProgressBar> managedProgressBar;
    shared_ptr<SNU_BMT_Interface<T>> interface;
    shared_ptr<LogManager> managedLogManager;

public:
    explicit SNU_BMT_ProcessManager(QProgressBar *progressBar, shared_ptr<SNU_BMT_Interface<T>> interface, shared_ptr<LogManager> logManager)
    {
        this->managedProgressBar = make_shared<bmtProcessProgressBar>(progressBar);
        this->interface = interface;
        this->managedLogManager = logManager;
    }

    //해당 함수는 비동기로 외부에서 호출 되기 때문에
    //여기서 사용되는 모든 GUI Component는 반드시 Main(UI) Thread 에서 동작 하도록 Invoke 필요
    //managedProgressBar, managedLogManager 함수 호출은 이러한 Invoke 가 들어가 있음
    void conductBMT(const int& numOfDataPath)
    {
        managedLogManager->WriteLogMessage("\nBMT Started");
        conduct_All_BMT_Process(numOfDataPath);
        managedLogManager->WriteLogMessage("BMT Finished");
    }

private:
    int getNumOfBatch(const int& numOfSamples)
    {
        const int batchSize = interface->GetBatchSize();
        return (numOfSamples + batchSize - 1) / batchSize;
    }
    void conduct_All_BMT_Process(const int& numOfDataPath)
    {
        //intialize Progress (이거 progressBar 모듈 따로 만들어서 관리)
        const int numOfBatch = getNumOfBatch(numOfDataPath);
        managedProgressBar->initialize(numOfBatch);

        //Load DataSet
        vector<string> dataPaths;
        for(int i =0;i<numOfDataPath;i++)
            dataPaths.push_back("temporary data path " + to_string(i));
        vector<vector<T>> dataVector = load_preprocessedData(dataPaths);

        //RunInference
        runInference(dataVector);

        //finalize Progress
        managedProgressBar->setValue(numOfBatch);
    }
    vector<vector<T>> load_preprocessedData(const vector<string>& dataPaths)
    {
        managedLogManager->WriteLogMessage("Loading and preprocessing data...");

        int numOfSamples = dataPaths.size();
        managedLogManager->WriteLogMessage("numOfSamples : " + QString::number(numOfSamples));

        vector<T> datas;
        for(int i =0;i<numOfSamples;i++)
        {
            T data = interface->convertToData(dataPaths[i]);
            datas.push_back(data);
        }

        vector<vector<T>> dataVector;
        const int batchSize = interface->GetBatchSize();
        for (int batch = 0; batch < getNumOfBatch(numOfSamples); batch++) {
            vector<T> currentBatch;
            for (int sample = 0; sample < batchSize; sample++) {
                int index = batch * batchSize + sample;
                if (index >= numOfSamples)
                    break;
                currentBatch.push_back(datas[index]);
            }
            dataVector.push_back(currentBatch);
        }
        managedLogManager->WriteLogMessage("Data loaded and preprocessed successfully");
        return dataVector;
    }

    void runInference(const vector<vector<T>>& dataVector)
    {
        const int numOfBatch = dataVector.size();
        managedLogManager->WriteLogMessage("Running inference for " + QString::number(numOfBatch) + " batches...");

        vector<double> latencies;
        vector<double> accuracies;
        for (int batch = 0; batch < numOfBatch; batch++) {
            auto start_time = chrono::high_resolution_clock::now();

            //batch 별 latency 측정 시작
            vector<string> output = interface->runInference(dataVector.at(batch));
            //batch 별 latency 측정 종료 (샘플별 기록하여 Average 내야함)

            managedLogManager->WriteLogMessage("[batch:" + QString::number(batch) + "] contains " + QString::number(output.size()) + " samples");
            auto end_time = chrono::high_resolution_clock::now();

            //update latencies
            chrono::duration<double, milli> latency = end_time - start_time;
            latencies.push_back(latency.count());

            //update accuracies
            for(int i = 0;i<output.size();i++)
            {
                double accuracy = get_accuracy(output.at(i));
                accuracies.push_back(accuracy);
            }
            QThread::sleep(1);//1초 대기 <----- 나중에 삭제 필요 (시뮬레이션)
            managedProgressBar->setValue(batch);
        }
        analyzePerformance(latencies, accuracies);
    }

    double get_accuracy(const string infereceResult)
    {
        //정확도 평가 로직 구현
        //실제 구현에서는 실제 레이블과 비교하여 정확도 계산
        return 99.0; //예시로 99%의 정확도를 반환
    }

    void analyzePerformance(const vector<double>& latencies, const vector<double>& accuracies)
    {
        managedLogManager->WriteLogMessage("Analyzing performance");
        double averageAccuracy = accumulate(accuracies.begin(), accuracies.end(), 0.0) / accuracies.size();
        double averageLatency = accumulate(latencies.begin(), latencies.end(), 0.0) / latencies.size();
        double throughput = 1000.0 / averageLatency;
        managedLogManager->WriteHighLightLogMessage("=== Benchmark Results ===");
        managedLogManager->WriteHighLightLogMessage("Average Accuracy: " + QString::number(averageAccuracy) + " %");
        managedLogManager->WriteHighLightLogMessage("Average Latency: " + QString::number(averageLatency) + " ms");
        managedLogManager->WriteHighLightLogMessage("Throughput: " + QString::number(throughput) + " FPS");
        managedLogManager->WriteHighLightLogMessage("Accuracy: 99.00 % (mocked value)");
        managedLogManager->WriteHighLightLogMessage("=========================");
    }
};


#endif // SNU_BMT_PROCESSMANAGER_H
