#include "logmanagerwidget.h"
#include "ui_logmanagerwidget.h"

LogManagerWidget::LogManagerWidget(QWidget *parent)
    : QWidget(parent)
    , ui(new Ui::LogManagerWidget)
{
    ui->setupUi(this);
    refresh();
}

QString LogManagerWidget::getLogDirPath()
{
    return  QCoreApplication::applicationDirPath() + "/Logs";
}

void LogManagerWidget::refresh()
{
    // Create Logs directory if not exists
    QString logsDirPath = getLogDirPath();
    QDir logsDir(logsDirPath);
    if (!logsDir.exists()) {
        if (!logsDir.mkpath(".")) {
            qDebug() << "Failed to create Logs directory";
            return;
        }
    }

    // Logs 디렉토리에서 파일 목록 가져오기
    ui->logListWidget->clear();
    QStringList logFiles = logsDir.entryList(QStringList() << "*.txt", QDir::Files);
    for (const QString &fileName : logFiles) {
        ui->logListWidget->addItem(fileName);
    }
}


LogManagerWidget::~LogManagerWidget()
{
    delete ui;
}

void LogManagerWidget::on_logListWidget_itemClicked(QListWidgetItem *item)
{
    QString logsDirPath = getLogDirPath();
    QString filePath = logsDirPath + "/" + item->text();
    QFile file(filePath);

    if (file.open(QIODevice::ReadOnly | QIODevice::Text)) {
        QTextStream in(&file);
        ui->logContentViewer->setText(in.readAll());
        file.close();
    } else {
        ui->logContentViewer->setText("Failed to open log file: " + filePath);
    }
}


void LogManagerWidget::on_refreshButton_clicked()
{
    refresh();
}


void LogManagerWidget::on_deleteLogButton_clicked()
{
    QListWidgetItem *selectedItem = ui->logListWidget->currentItem();
    if (!selectedItem) {
        ui->logContentViewer->setText("No log file selected.");
        return;
    }

    // 삭제 확인
    QMessageBox::StandardButton reply = QMessageBox::question(
        this, "Delete Log", "Are you sure you want to delete the selected log?",
        QMessageBox::Yes | QMessageBox::No
        );

    if (reply == QMessageBox::Yes) {
        QString logsDirPath = getLogDirPath();
        QString filePath = logsDirPath + "/" + selectedItem->text();

        QFile file(filePath);
        if (file.exists() && file.remove()) {
            ui->logContentViewer->setText("Log file deleted: " + filePath);
            delete selectedItem;
        } else {
            ui->logContentViewer->setText("Failed to delete log file: " + filePath);
        }
    }
}

