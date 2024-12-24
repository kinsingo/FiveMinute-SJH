#include "bmt_database_manager.h"

BMT_Database_Manager::BMT_Database_Manager(shared_ptr<LogManager> logManager) {
    networkManager = make_shared<QNetworkAccessManager>();
    this->logManager = logManager;
}


// BMT_Data 랜덤 생성 함수
BMT_Data BMT_Database_Manager::generateRandomBMTData(const QString& userEmail) {
    BMT_Data data;
    data.email = userEmail;
    data.latency_ms = 0.001 + QRandomGenerator::global()->generateDouble() * (0.999);    // 랜덤 지연 시간 (0.001 ~ 1.000 ms)
    data.accuracy = 50.0 + QRandomGenerator::global()->generateDouble() * (50.0);    // 랜덤 정확도 (50.0 ~ 100.0%)
    data.query = QRandomGenerator::global()->bounded(100, 10000);    // 랜덤 쿼리 수 (100 ~ 10000)
    return data;
}

// Optional_Data 랜덤 생성 함수
Optional_Data BMT_Database_Manager::generateRandomOptionalData() {
    Optional_Data data;
    QStringList cpuTypes = {"Intel i5", "Intel i7", "AMD Ryzen 5", "AMD Ryzen 7"};
    QStringList acceleratorTypes = {"DeepX NPU(M1)", "NVIDIA RTX 3080", "AMD Radeon RX 6800", "No Accelerator"};
    data.CPU_Type = cpuTypes.at(QRandomGenerator::global()->bounded(cpuTypes.size()));
    data.Accelerator_Type = acceleratorTypes.at(QRandomGenerator::global()->bounded(acceleratorTypes.size()));
    return data;
}


void BMT_Database_Manager::sendDataToDatabase(const BMT_Data& bmt_data, const Optional_Data& optional_data)
{
    QUrl apiUrl(BMT_WAS_URL::getResultURL());
    if (!apiUrl.isValid()) {
        logManager->WriteErrorLogMessage(BMT_WAS_URL::getLoginURL() + " is Invalid login POST URL.");
        return;
    }

    QNetworkRequest request(apiUrl);
    request.setHeader(QNetworkRequest::ContentTypeHeader, "application/json");

    QJsonObject jsonBody;
    //must data
    jsonBody["email"] = bmt_data.email;
    jsonBody["latency_ms"] = bmt_data.latency_ms;
    jsonBody["accuracy"] = bmt_data.accuracy;
    jsonBody["query"] = bmt_data.query;
    //optional data
    jsonBody["CPU_Type"] = optional_data.CPU_Type;
    jsonBody["Accelerator_Type"] = optional_data.Accelerator_Type;

    // 네트워크 매니저 요청 전송
    QNetworkReply *reply = networkManager->post(request, QJsonDocument(jsonBody).toJson());

    // 응답 처리
    QObject::connect(reply, &QNetworkReply::finished, [this, reply]()
    {
        if (reply->error() == QNetworkReply::NoError)
        {
            QByteArray response = reply->readAll();
            QJsonDocument jsonResponse = QJsonDocument::fromJson(response);
            QJsonObject jsonObject = jsonResponse.object();
            if (jsonObject["success"].toBool())
            {
                logManager->WriteHighLightLogMessage(jsonObject["message"].toString());
            }
            else
            {
                logManager->WriteErrorLogMessage(jsonObject["message"].toString());
            }
        }
        else
        {
            // 요청 실패 시 에러 메시지 출력
            logManager->WriteErrorLogMessage("Error:" + reply->errorString());
        }
        reply->deleteLater(); // 메모리 해제
    });
}
