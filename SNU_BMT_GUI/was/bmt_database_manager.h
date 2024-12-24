#ifndef BMT_DATABASE_MANAGER_H
#define BMT_DATABASE_MANAGER_H

#include <QDialog>
#include <QApplication>
#include <QWidget>
#include <QVBoxLayout>
#include <QLineEdit>
#include <QPushButton>
#include <QLabel>
#include <QNetworkAccessManager>
#include <QNetworkRequest>
#include <QNetworkReply>
#include <QJsonObject>
#include <QJsonDocument>
#include "bmt_was_url.h"
#include "logmanager.h"
#include <QRandomGenerator>

using namespace std;

struct BMT_Data
{
    QString email;
    double latency_ms;
    double accuracy;
    int query;
};

struct Optional_Data
{
    QString CPU_Type;
    QString Accelerator_Type;
};

class BMT_Database_Manager
{
private:
    shared_ptr<QNetworkAccessManager> networkManager;
    shared_ptr<LogManager> logManager;
public:
    BMT_Database_Manager(shared_ptr<LogManager> logManager);
    void sendDataToDatabase(const BMT_Data& bmt_data, const Optional_Data& optional_data);
    BMT_Data generateRandomBMTData(const QString& userEmail);
    Optional_Data generateRandomOptionalData();
};

#endif // BMT_DATABASE_MANAGER_H
