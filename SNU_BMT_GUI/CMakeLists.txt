cmake_minimum_required(VERSION 3.16)

project(SNU_AI_BMT_GUI_APP VERSION 0.1 LANGUAGES CXX)

set(CMAKE_AUTOUIC ON)
set(CMAKE_AUTOMOC ON)
set(CMAKE_AUTORCC ON)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

find_package(QT NAMES Qt6 Qt5 REQUIRED COMPONENTS Widgets Network)
find_package(Qt${QT_VERSION_MAJOR} REQUIRED COMPONENTS Widgets Network)

#Window QT creatror 에서는 대/소문자 구분 안 하지만
#Linux QT creatror 에서는 대/소문자 구분 함
#깔끔하게 header/source 모두 소문자로만 .. !
set(PROJECT_SOURCES

        #main
        main.cpp

        #ui
        ui/snu_bmt_gui.cpp
        ui/snu_bmt_gui.h
        ui/snu_bmt_gui.ui
        ui/snu_bmt_gui_template.h
        ui/logindialogmodal.h
        ui/logindialogmodal.cpp
        ui/logindialogmodal.ui
        ui/logmanagerwidget.h
        ui/logmanagerwidget.cpp
        ui/logmanagerwidget.ui
        ui/databaseresultmanagerwidget.h
        ui/databaseresultmanagerwidget.cpp
        ui/databaseresultmanagerwidget.ui

        #enums
        enum/bmt_enums.h

        #interfaces
        interface/snu_bmt_interface.h
        interface/snu_bmt_gui_caller.h
        interface/snu_bmt_gui_caller.cpp

        #login
        login/authmanager.h
        login/authmanager.cpp
        login/loginbutton.h
        login/loginbutton.cpp

        #log
        log/logmanager.h
        log/logmanager.cpp

        #was
        was/bmt_database_manager.h
        was/bmt_was_url.h
        was/bmt_database_manager.cpp
        was/bmt_was_url.cpp

        #theme
        theme/app_theme_manager.h
        theme/app_theme_manager.cpp

        #headers
        include/snu_bmt_processmanager.h
        include/bmt_process_progressbar.h

        #src
        src/bmt_process_progressbar.cpp

        #resources
        icons.qrc
)

if(${QT_VERSION_MAJOR} GREATER_EQUAL 6)

    #library
    add_library(SNU_AI_BMT_GUI_Library SHARED ${PROJECT_SOURCES})
    target_compile_definitions(SNU_AI_BMT_GUI_Library PRIVATE SNU_AI_BMT_GUI_LIBRARY)
    target_link_libraries(SNU_AI_BMT_GUI_Library PRIVATE Qt${QT_VERSION_MAJOR}::Widgets Qt${QT_VERSION_MAJOR}::Network)

    #exe    
    qt_add_executable(SNU_AI_BMT_GUI MANUAL_FINALIZATION ${PROJECT_SOURCES})
    target_link_libraries(SNU_AI_BMT_GUI PRIVATE SNU_AI_BMT_GUI_Library Qt${QT_VERSION_MAJOR}::Widgets Qt${QT_VERSION_MAJOR}::Network)

else()
    message(FATAL_ERROR "QT Version(=${QT_VERSION_MAJOR}) must be greater than or equal to 6")
endif()

include_directories(
    ${CMAKE_SOURCE_DIR}
    ${CMAKE_SOURCE_DIR}/include
    ${CMAKE_SOURCE_DIR}/ui
    ${CMAKE_SOURCE_DIR}/enum
    ${CMAKE_SOURCE_DIR}/interface
    ${CMAKE_SOURCE_DIR}/log
    ${CMAKE_SOURCE_DIR}/login
    ${CMAKE_SOURCE_DIR}/was
    ${CMAKE_SOURCE_DIR}/theme
)

set_target_properties(SNU_AI_BMT_GUI PROPERTIES WIN32_EXECUTABLE TRUE)
#set_target_properties(SNU_AI_BMT_GUI_Library PROPERTIES WIN32_EXECUTABLE TRUE) <-- 241127 주석 처리 했지만, 실제로 테스트는 안 해봄, dll 문제 발생시 주석 풀기
include(GNUInstallDirs)
install(TARGETS SNU_AI_BMT_GUI
    BUNDLE DESTINATION .
    LIBRARY DESTINATION ${CMAKE_INSTALL_LIBDIR}
    RUNTIME DESTINATION ${CMAKE_INSTALL_BINDIR}
)

if(QT_VERSION_MAJOR EQUAL 6)
    qt_finalize_executable(SNU_AI_BMT_GUI)
endif()
