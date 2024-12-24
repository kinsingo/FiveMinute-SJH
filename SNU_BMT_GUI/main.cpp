#include <QApplication>
#include "snu_bmt_interface.h"
#include <thread>         // std::this_thread::sleep_for
#include <chrono>         // std::chrono::milliseconds
#include <random>         // std::random_device, std::mt19937, std::uniform_int_distribution
#include "snu_bmt_gui_template.h"

template<typename T>
class Virtual_Submitter_Implementation : public SNU_BMT_Interface<T>
{
private:
    void SleepForRandomMilliSeconds(const int& Min_ms, const int& Max_ms)
    {
        std::random_device rd;
        std::mt19937 gen(rd());
        std::uniform_int_distribution<> distr(Min_ms, Max_ms); // 5ms ~ 50ms 사이의 랜덤 값
        int delay = distr(gen); // 랜덤 지연 시간을 생성합니다.
        std::this_thread::sleep_for(std::chrono::milliseconds(delay)); // 지연 시간을 적용합니다.
    }

public:

    //제공한 데이터에 대해서, NPU 에서 원하는 DataType 으로 업데이트
    virtual T convertToData(const string& imagePath) override
    {
        int* data = new int[200*200];
        for(int i = 0;i<200*200;i++)
            data[i]=i;
        return data;
    }

    //GetBatchSize()로 전달된 설정된 Batch 개수만큼, runInference 로 데이터 전달
    virtual int GetBatchSize() override
    {
        return 5;
    }

    virtual vector<string> runInference(const vector<T>& data) override
    {
        const int Min_ms = 5;
        const int Max_ms = 50;
        SleepForRandomMilliSeconds(Min_ms,  Max_ms);
        vector<string> results;
        for(int i =0;i<data.size();i++)
            results.push_back("10" + data.at(i)[0]);
        return results;
    }
};


int main(int argc, char *argv[])
{
    using DataType = int* ; //위 T convertToData(const string& imagePath) 에서 반환되는 T 의 데이터 타입
    QApplication a(argc, argv);
    shared_ptr<SNU_BMT_Interface<DataType>> interface = make_shared<Virtual_Submitter_Implementation<DataType>>();
    SNU_BMT_GUI_TEMPLATE<DataType> w(interface, &a);
    w.show();
    return a.exec();
}



