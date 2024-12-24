#ifndef LOGINDIALOGMODAL_H
#define LOGINDIALOGMODAL_H

#include <QDialog>
#include <QWidget>
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

using namespace std;

namespace Ui {
class loginDialogModal;
}

class loginDialogModal : public QDialog
{
    Q_OBJECT
    QWidget *titleWidget;
    bool isValidUser;
    QString userEmail;
    shared_ptr<QNetworkAccessManager> networkManager;

private:
    void sendLoginPostRequest();
    void displayErrorMessage(const QString& message);
    bool IsValidInput(const QString& email, const QString& password);
    void setSignInButtonDisable();
    void setSignInButtonEnable();
public:
    void resetState();
    explicit loginDialogModal(QWidget *parent = nullptr);
    ~loginDialogModal();
    bool isUserValid();
    QString getUserEmail();

private slots:
    void on_signInButton_clicked();

private:
    Ui::loginDialogModal *ui;
};

#endif // LOGINDIALOGMODAL_H
