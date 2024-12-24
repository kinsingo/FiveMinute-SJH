#ifndef LOGMANAGERWIDGET_H
#define LOGMANAGERWIDGET_H

#include <QWidget>
#include <QListWidget>
#include <QTextEdit>
#include <QVBoxLayout>
#include <QDir>
#include <QFile>
#include <QTextStream>
#include <QDebug>
#include <QMessageBox>

namespace Ui {
class LogManagerWidget;
}

class LogManagerWidget : public QWidget
{
    Q_OBJECT

public:
    static QString getLogDirPath();
    void refresh();

public:
    explicit LogManagerWidget(QWidget *parent = nullptr);
    ~LogManagerWidget();


private slots:
    void on_logListWidget_itemClicked(QListWidgetItem *item);

    void on_refreshButton_clicked();

    void on_deleteLogButton_clicked();

private:
    Ui::LogManagerWidget *ui;
};

#endif // LOGMANAGERWIDGET_H
