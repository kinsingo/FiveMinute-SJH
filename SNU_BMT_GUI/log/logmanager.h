#ifndef LOGMANAGER_H
#define LOGMANAGER_H

#pragma once

#include <QTextEdit>
#include <QTextCursor>
#include <QColor>
#include <QFile>
#include <QTextStream>
#include <QFileDialog>
#include <QMessageBox>
#include <QDir>
#include <QDateTime>
#include <QCoreApplication>
#include "logmanagerwidget.h"

using namespace std;

class LogManager
{
private:
    QTextEdit* textEdit;

    QColor textColor;
    QColor highLight_textColor;
    QColor error_textColor;

public:
    void SetTextColor(const QColor& textColor);
    void SetHighLightTextColor(const QColor& textColor);
    void SetErrorTextColor(const QColor& textColor);
    void changeAllTestColor(const QColor& textColor);

private:
    void WriteLogMessage(const QString& message, const QColor& color);
public:
    explicit LogManager(QTextEdit* textEdit);
    void WriteLogMessage(const QString& message);
    void WriteHighLightLogMessage(const QString& message);
    void WriteErrorLogMessage(const QString& message);

    void clear();
    void saveLogAsFile();
};

#endif // LOGMANAGER_H
