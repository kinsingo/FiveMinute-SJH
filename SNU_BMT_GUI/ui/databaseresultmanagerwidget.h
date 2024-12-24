#ifndef DATABASERESULTMANAGERWIDGET_H
#define DATABASERESULTMANAGERWIDGET_H

#include <QWidget>
#include <QApplication>
#include <QTableView>
#include <QStandardItemModel>
#include <QStandardItem>
#include <QStringList>
#include <QTimer>
#include <cstdlib>
#include <ctime>


namespace Ui {
class DatabaseResultManagerWidget;
}

class DatabaseResultManagerWidget : public QWidget
{
    Q_OBJECT

public:
    explicit DatabaseResultManagerWidget(QWidget *parent = nullptr);
    ~DatabaseResultManagerWidget();
    void readDataFromServer();

private slots:
    void on_readDataFromServerButton_clicked();

private:
    Ui::DatabaseResultManagerWidget *ui;
    QStandardItemModel* model;
};

#endif // DATABASERESULTMANAGERWIDGET_H
