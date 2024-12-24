# SNU_BMT_GUI
QT Widgets C++

# 241212
1) 폴더 구조 정리함 (CmakeList 에서 include_directories(..) 와 set(PROJECT_SOURCES ..) 부분 수정해서 관리)
2) Task 는 Classfication 과 Object Detection 만 남기고 나머지는 없앴음 (Dataset도 그에따라 삭제함)

# 241213
1) snu_bmt_interface.h 부분에서, batch 사이즈만큼 run_inference 할 때 데이터 받을 수 있도록 함, 추가로 T convertTo(Data); 통해서, 미리 폴더에 있는 Dataset 을 프로그램 배열로 미리 불러올때 convertTo(..) 사용해서 변환된 양식으로 데이터 저장 하도록 함.

# 241219
1) (SNU_BMT_GUI) GUI 의 경우 Template 이 적용 불가하기 때문에, 해당class 를 상속받는 SNU_BMT_GUI_TEMPLATE 를 구현함

# 241225
1) Main, Log, Private Result 들을Page(Widget) 별로 선택해서 UI 에서 볼 수 있도록 함(QStackedWidget 활용)

# To-Do
1) 이런식으로 Model/Dataset 다운로드 수동으로 다운로드 가능하도록 버튼 추가(File System 과 연동)
2) BMT Offline 모드로 실행 가능하도록, 그러나 확인 한번 하도록 QMessageBox 추가하기 (Start BMT 부분)
3) void DatabaseResultManagerWidget::readDataFromServer() 부분을 WAS Backend API 사용해서 실제 WAS 의 Private DB 결과 받아오도록 구현
   이미 아래 getResultURL() 부분에 Post 구현 되어있음, 이쪽 Backend API 에서 GET 만 구현해서 적용 하면 됨
```
QString BMT_WAS_URL::getResultURL()
{
    return getBaseURL() + "/api/bmt-gui-app-database";
}
```

# 기억할것
1) 비동기로 호출되는 함수의 경우, 여기에서 GUI Component 는 반드시 main(UI) thread 에서 동작 하도록, 해당 Component 에 대해서 Invoke 해야함(그렇지 않으면 메모리 충돌 혹은 비정상 업데이트 등 이상 동작 발생함)

  