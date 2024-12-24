#ifndef SNU_BMT_INTERFACE_H
#define SNU_BMT_INTERFACE_H

#ifdef _WIN32 //(.dll)
#define EXPORT_SYMBOL __declspec(dllexport)
#else //Linux(.so) and other operating systems
#define EXPORT_SYMBOL
#endif
#include <vector>
#include <iostream>
using namespace std;

//240913
//ONNX Model은 Web을 통해 사용자가 직접 다운로드하도록 하고,
//NPU에 맞게 컴파일된 Model을 Load 하는 작업은 main 함수에서 실행하며,
//Load된 Model을 멤버 변수로 저장하여, runInference 함수에서 이를 사용하도록 권장함.
//이렇게 하면 runInference 함수에 Model Loading 시간이 포함되지 않도록 할 수 있음..

template <typename T>
class EXPORT_SYMBOL SNU_BMT_Interface
{
public:
   virtual ~SNU_BMT_Interface(){}

  //제공한 데이터에 대해서, NPU 에서 원하는 DataType 으로 업데이트
   virtual T convertToData(const string& imagePath) = 0;

   //GetBatchSize()로 전달된 설정된 Batch 개수만큼, runInference 로 데이터 전달
   virtual int GetBatchSize() = 0;
   virtual vector<string> runInference(const vector<T>& data) = 0;
};

#endif // SNU_BMT_INTERFACE_H


