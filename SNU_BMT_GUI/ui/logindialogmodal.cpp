#include "logindialogmodal.h"
#include "./ui/ui_logindialogmodal.h"

loginDialogModal::loginDialogModal(QWidget *parent) :
    QDialog(parent),
    ui(new Ui::loginDialogModal)
{
    ui->setupUi(this);
    this->setWindowTitle("BMT Login");
    networkManager = make_shared<QNetworkAccessManager>();
    resetState();
}

loginDialogModal::~loginDialogModal()
{
    delete ui;
}

void loginDialogModal::resetState() {
    ui->emailField->clear();
    ui->passwordField->clear();
    ui->resultLabel->clear();
    isValidUser = false;
    userEmail = "";
}

void loginDialogModal::displayErrorMessage(const QString& message)
{
    ui->resultLabel->setText(message);
    ui->resultLabel->setStyleSheet("color: #F44335; font-size: 12px;font-weight: 600;");
}

bool loginDialogModal::IsValidInput(const QString& email, const QString& password)
{
    if (email.isEmpty() || password.isEmpty()) {
        displayErrorMessage("Email and password cannot be empty.");
        return false;
    }

    if (!email.contains("@")) {
        displayErrorMessage("Email should contain '@'.");
        return false;
    }

    static const QRegularExpression specialCharRegex("[!#$%^&*(),?\":{}|<>]");//한번만 생성
    if (specialCharRegex.match(email).hasMatch()) {
        displayErrorMessage("Email should not contain special characters.");
        return false;
    }

    if (password.trimmed().isEmpty() || password.trimmed().length() < 8) {
        displayErrorMessage("Password must be at least 8 characters long.");
        return false;
    }
    return true;
}


void loginDialogModal::setSignInButtonDisable()
{
    ui->signInButton->setEnabled(false);
    ui->signInButton->setText("LOGGING IN...");
    ui->signInButton->setStyleSheet("background-color: #1662C4; color: white; font-size: 16px; font-weight: 600; padding: 10px; border-radius: 10px; text-align: center;");
}

void loginDialogModal::setSignInButtonEnable()
{
    ui->signInButton->setEnabled(true);
    ui->signInButton->setText("SIGN IN");
    ui->signInButton->setStyleSheet("background-color: #1A73E8; color: white; font-size: 16px; font-weight: 600; padding: 10px; border-radius: 10px; text-align: center;");
}

void loginDialogModal::sendLoginPostRequest()
{
    isValidUser = false;
    userEmail = "";

    // 입력값 가져오기
    QString email = ui->emailField->text();
    QString password = ui->passwordField->text();

    if(!IsValidInput(email,password))
        return;

    // 요청 전 버튼 비활성화 및 텍스트 변경
    setSignInButtonDisable();

    ui->signInButton->setEnabled(false);
    ui->signInButton->setText("LOGGING IN...");
    ui->signInButton->setStyleSheet("background-color: #1662C4; color: white; font-size: 16px; font-weight: 600; padding: 10px; border-radius: 10px; text-align: center;");

    // JSON 요청 데이터 생성
    QJsonObject json;
    json["email"] = email;
    json["password"] = password;

    // POST 요청 초기화
    QUrl url(BMT_WAS_URL::getLoginURL()); // QString -> QUrl 변환
    if (!url.isValid()) {
        displayErrorMessage(BMT_WAS_URL::getLoginURL() + " is Invalid login POST URL.");
        return;
    }

    QNetworkRequest request(url); // QUrl 객체 사용
    request.setHeader(QNetworkRequest::ContentTypeHeader, "application/json");

    // 네트워크 매니저 요청 전송 (post)
    QNetworkReply *reply = networkManager->post(request, QJsonDocument(json).toJson());

    // 응답 처리 (post 가 finished 했다는 신호를 reply 가 받게되면, 아래 lambda 함수 실행됨)
    connect(reply, &QNetworkReply::finished, this, [this, reply]()
    {
        // 요청 완료 후 버튼 복원
        setSignInButtonEnable();

        if (reply->error() == QNetworkReply::NoError)
        {
            QByteArray response = reply->readAll();
            QJsonDocument jsonResponse = QJsonDocument::fromJson(response);
            QJsonObject jsonObject = jsonResponse.object();
            if (jsonObject["success"].toBool())
            {
                isValidUser = true;
                QJsonObject userObject = jsonObject["user"].toObject();
                userEmail = userObject["email"].toString();
                this->accept();//QDialog::Accepted 을 반환하여 다이얼로그가 성공적으로 완료되었음을 나타냄 (dialog.exec() == QDialog::Accepted) 이런식으로 사용
            }
            else
            {
                displayErrorMessage(jsonObject["message"].toString());
            }
        }
        else
        {
            ui->resultLabel->setText("Error: " + reply->errorString());
        }
        reply->deleteLater();// 메모리 해제
    });
}


void loginDialogModal::on_signInButton_clicked()
{
    sendLoginPostRequest();
}

bool loginDialogModal::isUserValid()
{
    return isValidUser;
}

QString loginDialogModal::getUserEmail()
{
    return userEmail;
}


