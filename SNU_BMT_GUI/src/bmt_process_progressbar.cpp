#include "bmt_process_progressbar.h"

bmtProcessProgressBar::bmtProcessProgressBar(QProgressBar* progressBar) {
    this->progressBar=progressBar;

}

void bmtProcessProgressBar::initialize(int numOfBatch)
{
    //이렇게 UI Component 가 Main(UI) Thread 에서 동작해야만
    //예상치 못한 Run-time 메모리 문제 피할 수 있음 (bmt process 가 비동기도 동작하기에, 반드시 필요)
    QMetaObject::invokeMethod(progressBar, [this, numOfBatch]() {
        progressBar->setMaximum(numOfBatch);
        progressBar->setMinimum(0);
        progressBar->setValue(0);
    });
}

void bmtProcessProgressBar::setValue(int value)
{
    //이렇게 UI Component 가 Main(UI) Thread 에서 동작해야만
    //예상치 못한 Run-time 메모리 문제 피할 수 있음 (bmt process 가 비동기도 동작하기에, 반드시 필요)
    QMetaObject::invokeMethod(progressBar, [this, value]() {
         progressBar->setValue(value);
    });
}
