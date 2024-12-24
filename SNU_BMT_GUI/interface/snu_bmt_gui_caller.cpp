#include "snu_bmt_gui_caller.h"
#include "snu_bmt_gui_template.h"
#include <QApplication>

template<typename T>
SNU_BMT_GUI_Caller<T>::SNU_BMT_GUI_Caller(shared_ptr<SNU_BMT_Interface<T>> interface)
{
    this->interface = interface;
}

template<typename T>
int SNU_BMT_GUI_Caller<T>::call_BMT_GUI(int argc, char *argv[])
{
    QApplication a(argc, argv);
    SNU_BMT_GUI_TEMPLATE<T> w(interface, &a);
    w.show();
    return a.exec();
}
