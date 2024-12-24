#ifndef SNU_BMT_GUI_H
#define SNU_BMT_GUI_H

#pragma once
#include <QMainWindow>
#include <QMessageBox>
#include <QMenu>
#include <QAction>
#include <QMenuBar>
#include <QTimer>
#include <QThread>
#include <QtConcurrent/QtConcurrent>
#include <QDialog>
#include "app_theme_manager.h"
#include "logmanager.h"
#include "authmanager.h"
#include "bmt_database_manager.h"
#include <QSettings>
#include <QStatusBar>
#include "logmanagerwidget.h"
#include <QStackedWidget>
#include "databaseresultmanagerwidget.h"

using namespace std;

QT_BEGIN_NAMESPACE
namespace Ui {
class SNU_BMT_GUI;
}
QT_END_NAMESPACE

//QMainWindow 는 Template 사용 못 함
//그래서 번거롭지만, SNU_BMT_GUI_TEMPLATE 에서 상속 받아서 Template dependent 한 부분들 구현
//최종 Submiiter 구현부는 SNU_BMT_GUI 이 아닌 SNU_BMT_GUI_TEMPLATE 으로 GUI 호출 되어야 함
class SNU_BMT_GUI : public QMainWindow
{
    Q_OBJECT

public:
    SNU_BMT_GUI(QApplication* app_ptr, QWidget *parent = nullptr);
    ~SNU_BMT_GUI();

protected slots:
    virtual void on_btnBMTStart_clicked() = 0;

protected slots:
    void on_actionAbout_SNU_BMT_triggered();
    void on_actionDark_triggered();
    void on_actionLight_triggered();
    void on_btnSaveLog_clicked();
    void on_btnClearLog_clicked();
    //used to test mongoDB
    void on_btnWriteDataToPrivateDB_clicked();
    //used for login/logout
    void on_btnAuth_clicked();

protected:
    Ui::SNU_BMT_GUI* ui;
    QStackedWidget* stackedWidget;
    LogManagerWidget* logManagerWidget;
    DatabaseResultManagerWidget* resultManagerWidget;

    shared_ptr<AppThemeManager> mainFormThemeManager;
    shared_ptr<LogManager> logManager;
    shared_ptr<AuthManager> authManager;
    shared_ptr<loginDialogModal> loginForm;
    shared_ptr<BMT_Database_Manager> bmtDBManager;


private slots:
    void on_actionSave_triggered();
    void on_actionLoad_triggered();
    void on_actionmain_triggered();
    void on_actionLog_triggered();
    void on_actionPrivate_Results_triggered();
};
#endif // SNU_BMT_GUI_H
