#include "snu_bmt_gui.h"
#include "./ui_snu_bmt_gui.h"

SNU_BMT_GUI::SNU_BMT_GUI(QApplication *app_ptr, QWidget *parent): QMainWindow(parent), ui(new Ui::SNU_BMT_GUI)
{
    //Static UI elements Setup (By Design Tool)
    ui->setupUi(this);
    app_ptr->setStyle(QStringLiteral("Fusion"));//"Fusion" 스타일은 모든 플랫폼에서 동일하게 보임

    //stackedWidget 에 필요한 Page 추가
    QWidget* originalCentralWidget = ui->centralwidget;
    logManagerWidget = new LogManagerWidget(this);
    resultManagerWidget = new DatabaseResultManagerWidget(this);

    stackedWidget = new QStackedWidget(this);
    stackedWidget->addWidget(originalCentralWidget); // 기존 centralwidget 추가
    stackedWidget->addWidget(logManagerWidget); // LogViewerWidget 추가
    stackedWidget->addWidget(resultManagerWidget); // resultManagerWidget 추가
    setCentralWidget(stackedWidget); // 스택 위젯을 centralwidget 으로 설정

    //Log Manager
    logManager = make_shared<LogManager>(ui->LogTextEdit);

    //Theme Manager
    QWidget* target = this;
    bool isDarkTheme = true;
    mainFormThemeManager = make_shared<AppThemeManager>(logManager, target, isDarkTheme);
    mainFormThemeManager->SetDarkTheme();

    //authManger : 이상 동작 방지를 위해 loginDialogModal 은 반드시 SNU_BMT_GUI 와 같은 곳에서 (AuthManager 안에서 처리 X)
    loginForm = make_shared<loginDialogModal>(this);//ui component 끼리는 메모리 삭제가 의존적임. loginForm은 반드시 여기에 생성.
    authManager = make_shared<AuthManager>(loginForm, ui->btnAuth, mainFormThemeManager, logManager);

    //BMT DB Manager
    bmtDBManager = make_shared<BMT_Database_Manager>(logManager);

    //Base URL 통해서 개발 모드인지, 배포 모드인지 확인
    logManager->WriteLogMessage("AI BMT WAS URL : " + BMT_WAS_URL::getBaseURL());
}

SNU_BMT_GUI::~SNU_BMT_GUI()
{
    delete ui;
}

void SNU_BMT_GUI::on_actionAbout_SNU_BMT_triggered()
{
    //이 부분은 나중에, WAS / Github 링크 등을 추가하여 바로 이동 가능하도록 하기
    //해당 App 의 Manual 은 나중에 WAS 에 포함하기
    //Youtube Demo 영상 보는 쪽으로 Manual 링크 추가
    QMessageBox::information(this,"SNU BMT", "This is our SNU BMT project");

}

void SNU_BMT_GUI::on_actionDark_triggered()
{
    mainFormThemeManager->SetDarkTheme();
}

void SNU_BMT_GUI::on_actionLight_triggered()
{
    mainFormThemeManager->SetLightTheme();
}

// 이거는 SNU_BMT_GUI_TEMPLATE 에서 상속 받아서 구현함 (pure virtual method)
// void SNU_BMT_GUI::on_btnBMTStart_clicked()
// {
//     logManager->WriteLogMessage("on_btnBMTStart_clicked from SNU_BMT_GUI class");
// }

void SNU_BMT_GUI::on_btnSaveLog_clicked()
{
    logManager->saveLogAsFile();
}

void SNU_BMT_GUI::on_btnClearLog_clicked()
{
    logManager->clear();
}

void SNU_BMT_GUI::on_btnWriteDataToPrivateDB_clicked()
{
    if(!loginForm->isUserValid())
        authManager->Authentication();

    QString userEmail = loginForm->getUserEmail();
    BMT_Data bmtData = bmtDBManager->generateRandomBMTData(userEmail);
    Optional_Data optionalData = bmtDBManager->generateRandomOptionalData();
    bmtDBManager->sendDataToDatabase(bmtData, optionalData);
}

void SNU_BMT_GUI::on_btnAuth_clicked()
{
    authManager->Authentication();
}


//setting 부분은 ui component 직접 관리해야 하는게 많아서, 그냥 여기서 처리하는게 유리할듯
//왜냐하면 ui 자체를 직접 다른 class 에서 접근 할 수는 없기 때문
void SNU_BMT_GUI::on_actionSave_triggered()
{
    // QSettings 초기화 (애플리케이션 이름과 조직 이름을 설정)
    QSettings settings("SNU_BMT_GUI", "SNU Organization");

    //GUI 사이즈
    settings.setValue("gui/size", this->size()); // 현재 창 크기를 저장

    //시나리오
    settings.setValue("gui/radioButton_SingleStream", ui->radioButton_SingleStream->isChecked());
    settings.setValue("gui/radioButton_MultiStream", ui->radioButton_MultiStream->isChecked());
    settings.setValue("gui/radioButton_Offline", ui->radioButton_Offline->isChecked());

    //Classification
    //1.Model
    settings.setValue("gui/classification/model/radioButton_Resnet50", ui->radioButton_Resnet50->isChecked());
    //2.Dataset
    settings.setValue("gui/classification/dataset/radioButton_ImageNet2012_Large", ui->radioButton_ImageNet2012_Large->isChecked());
    settings.setValue("gui/classification/dataset/radioButton_ImageNet2012_Small", ui->radioButton_ImageNet2012_Small->isChecked());

    //ObjectDetection
    //1.Model
    settings.setValue("gui/objectDetection/model/radioButton_YOLOv5s", ui->radioButton_YOLOv5s->isChecked());
    //2.Dataset
    settings.setValue("gui/objectDetection/dataset/radioButton_coco2017", ui->radioButton_coco2017->isChecked());

    statusBar()->showMessage("GUI 상태가 저장되었습니다.", 5000);
}
void SNU_BMT_GUI::on_actionLoad_triggered()
{
    // QSettings 초기화 (저장된 설정 읽기)
    QSettings settings("SNU_BMT_GUI", "SNU Organization");

    // GUI 사이즈
    this->resize(settings.value("gui/size", QSize(800, 600)).toSize()); // 기본값 800x600

    //시나리오
    ui->radioButton_SingleStream->setChecked(settings.value("gui/radioButton_SingleStream", false).toBool());
    ui->radioButton_MultiStream->setChecked(settings.value("gui/radioButton_MultiStream", false).toBool());
    ui->radioButton_Offline->setChecked(settings.value("gui/radioButton_Offline", false).toBool());

    //Classification
    //1.Model
    ui->radioButton_Resnet50->setChecked(settings.value("gui/classification/model/radioButton_Resnet50", false).toBool());
    //2.Dataset
    ui->radioButton_ImageNet2012_Large->setChecked(settings.value("gui/classification/dataset/radioButton_ImageNet2012_Large", false).toBool());
    ui->radioButton_ImageNet2012_Small->setChecked(settings.value("gui/classification/dataset/radioButton_ImageNet2012_Small", false).toBool());

    //ObjectDetection
    //1.Model
    ui->radioButton_YOLOv5s->setChecked(settings.value("gui/objectDetection/model/radioButton_YOLOv5s", false).toBool());
    //2.Dataset
    ui->radioButton_coco2017->setChecked(settings.value("gui/objectDetection/dataset/radioButton_coco2017", false).toBool());

    statusBar()->showMessage("GUI 상태가 불러와졌습니다.", 5000); // 5000ms = 5초
}


void SNU_BMT_GUI::on_actionmain_triggered()
{
    stackedWidget->setCurrentIndex(0);
}


void SNU_BMT_GUI::on_actionLog_triggered()
{
    stackedWidget->setCurrentIndex(1);
    logManagerWidget->refresh();
}


void SNU_BMT_GUI::on_actionPrivate_Results_triggered()
{
    if(!loginForm->isUserValid())
        authManager->Authentication();

     if(!loginForm->isUserValid())
    {
        logManager->WriteErrorLogMessage("Please login before watching your performance results.");
        return;//위에서 로그인 안 하고 그냥 종료해버리면, 여기 못 넘어가도록 하기
    }

    stackedWidget->setCurrentIndex(2);
    resultManagerWidget->readDataFromServer();
}

