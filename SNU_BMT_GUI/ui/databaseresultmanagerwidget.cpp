#include "databaseresultmanagerwidget.h"
#include "ui_databaseresultmanagerwidget.h"

DatabaseResultManagerWidget::DatabaseResultManagerWidget(QWidget *parent)
    : QWidget(parent)
    , ui(new Ui::DatabaseResultManagerWidget)
{
    ui->setupUi(this);

    // 모델 초기화 및 테이블 설정
    model = new QStandardItemModel(this);
    ui->tableView->setModel(model);
    ui->tableView->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);//열 너비 자동 조절 (Stretch 설정함, 추후 필요시 변경)
    ui->tableView->setEditTriggers(QAbstractItemView::NoEditTriggers);//Read Only 설정

    // 초기 데이터 로드
    readDataFromServer();
}

DatabaseResultManagerWidget::~DatabaseResultManagerWidget()
{
    delete ui;
}

 //여기 우선 임시로 데이터 생성 (나중에 WAS Backend API 사용해서 받아오는거로 구현 대체 필요 !!)
//bmtDBManager->sendDataToDatabase(bmtData, optionalData) 이거 구현 참조 ! (WAS 와 Network Post 및 Result 처리 부분)
//여기서는 Post가 아닌, Get 으로 구현 해야함
void DatabaseResultManagerWidget::readDataFromServer()
{
    // 모델 초기화 및 컬럼 설정
    model->clear();
    QStringList headers = {"ID", "Task", "Accuracy (%)", "Latency (ms)"};
    model->setHorizontalHeaderLabels(headers);

     // 임의 데이터 추가
    auto createCenteredItem = [](const QString &text) {
        QStandardItem *item = new QStandardItem(text);
        item->setTextAlignment(Qt::AlignCenter);  // 텍스트 중앙 정렬
        return item;
    };
    for (int i = 1; i <= 5; ++i) {
        QList<QStandardItem*> row;
        row.append(createCenteredItem(QString::number(i)));  // ID
        row.append(createCenteredItem("classification"));    // Task
        row.append(createCenteredItem(QString::number(95.0 + i * 0.1))); // Accuracy
        row.append(createCenteredItem(QString::number(500 + i * 20)));   // Latency
        model->appendRow(row);
    }
}

void DatabaseResultManagerWidget::on_readDataFromServerButton_clicked()
{
    readDataFromServer();
}

