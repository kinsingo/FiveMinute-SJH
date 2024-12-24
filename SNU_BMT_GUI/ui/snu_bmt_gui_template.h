#ifndef SNU_BMT_GUI_TEMPLATE_H
#define SNU_BMT_GUI_TEMPLATE_H

#include "./snu_bmt_gui.h"
#include <string>
#include "snu_bmt_processmanager.h"
#include "ui_snu_bmt_gui.h" // 이 파일이 필요합니다.

using namespace std;

template<typename T>
class SNU_BMT_GUI_TEMPLATE : public SNU_BMT_GUI
{
private:
    shared_ptr<SNU_BMT_ProcessManager<T>> processManager;
public:
    SNU_BMT_GUI_TEMPLATE(shared_ptr<SNU_BMT_Interface<T>> interface, QApplication* app_ptr, QWidget *parent = nullptr)
        : SNU_BMT_GUI(app_ptr, parent)
    {
        //logManager 는 SNU_BMT_GUI 에서 생성 되었음
        processManager = make_shared<SNU_BMT_ProcessManager<T>>(ui->progressBar, interface,logManager);
    }

protected:
    virtual void on_btnBMTStart_clicked() override
    {
        disableGUI();
        const int numOfDataPath = 53;

        // 비동기로 conductBMT 실행, QtConcurrent::run 반환값 QFuture 사용 안 할거라서
        //(void)하여 Build Warning 없앰
        (void)QtConcurrent::run([this, numOfDataPath]() {
            processManager->conductBMT(numOfDataPath);

            // 비동기 작업 완료 후 메인 스레드에서 UI 다시 활성화
            QMetaObject::invokeMethod(this, [this]() {
                enableGUI();
            });
        });
    }

private:
    void disableGUI()
    {
        for (auto& widget : this->findChildren<QWidget*>()) {
            widget->setEnabled(false);
        }

        // 작업 중 Wait 커서 표시
        QApplication::setOverrideCursor(Qt::WaitCursor);
    }

    void enableGUI()
    {
        for (auto& widget : this->findChildren<QWidget*>()) {
            widget->setEnabled(true);
        }

        // 작업 완료 후 커서 복원
        QApplication::restoreOverrideCursor();
    }
};





#endif // SNU_BMT_GUI_TEMPLATE_H
