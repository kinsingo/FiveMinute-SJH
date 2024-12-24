#include "logmanager.h"

LogManager::LogManager(QTextEdit *textEdit)
{
    this->textEdit = textEdit;
    SetTextColor(Qt::black);
    SetHighLightTextColor(Qt::black);
}

void LogManager::SetTextColor(const QColor& textColor)
{
     this->textColor = textColor;
}

void LogManager::SetHighLightTextColor(const QColor& textColor)
{
    this->highLight_textColor = textColor;
}

void LogManager::SetErrorTextColor(const QColor& textColor)
{
    this->error_textColor = textColor;
}

void LogManager::changeAllTestColor(const QColor& textColor)
{
    textEdit->selectAll();
    textEdit->setTextColor(textColor);
    textEdit->moveCursor(QTextCursor::End);
}

void LogManager::WriteLogMessage(const QString& message)
{
    WriteLogMessage(message, this->textColor);
}

void LogManager::WriteHighLightLogMessage(const QString& message)
{
    WriteLogMessage(message, this->highLight_textColor);
}

void LogManager::WriteErrorLogMessage(const QString& message)
{
    WriteLogMessage(message, this->error_textColor);
}

void LogManager::WriteLogMessage(const QString& message, const QColor& color)
{
    //textEdit 에 대해서 이렇게 invokeMethod 해주어야, 메인(UI) 스레드에서 동작
    //textEdit는 UI 요소이므로, 모든 업데이트 작업은 반드시 아래처럼 메인(UI) 스레드에서 실행되어야 함
    //비동기로 동작할때, 이렇게 해주어야 잘못 동작 방지
    QMetaObject::invokeMethod(textEdit, [this, message, color]() {
        textEdit->setTextColor(color);
        textEdit->append(message);
        textEdit->moveCursor(QTextCursor::End);
    });
}

void LogManager::clear()
{
    textEdit->clear();
}

void LogManager::saveLogAsFile()
{
    // Create Logs directory if not exists
    QString logsDirPath = LogManagerWidget::getLogDirPath();
    QDir logsDir(logsDirPath);
    if (!logsDir.exists()) {
        if (!logsDir.mkpath(".")) {
            qDebug() << "Failed to create Logs directory";
            return;
        }
    }

    // Generate file name based on current date and time
    QString currentDateTime = QDateTime::currentDateTime().toString("yyyyMMdd_HHmmss");
    QString fileName = logsDir.filePath(currentDateTime + "_log.txt");

    // Save the file
    QFile file(fileName);
    if (!file.open(QIODevice::WriteOnly | QIODevice::Text)) {
        qDebug() << "Failed to open file for writing:" << fileName;
        return;
    }

    QTextStream out(&file);
    out << textEdit->toPlainText() << "\n";
    file.close();

    if (fileName.isEmpty())
        return;

    if (!fileName.endsWith(".txt"))
        fileName += ".txt";

    QMessageBox::information(nullptr, "File Saved", "File saved successfully to:\n" + fileName);
}
