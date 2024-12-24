#ifndef BMT_PROCESS_PROGRESSBAR_H
#define BMT_PROCESS_PROGRESSBAR_H
#include <QProgressBar>


class bmtProcessProgressBar
{
private:
    QProgressBar* progressBar;

public:
    bmtProcessProgressBar(QProgressBar* progressBar);
    void initialize(int numOfBatch);
    void setValue(int value);
};

#endif // BMT_PROCESS_PROGRESSBAR_H
