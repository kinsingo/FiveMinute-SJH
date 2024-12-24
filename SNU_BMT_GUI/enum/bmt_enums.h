#ifndef BMT_ENUMS_H
#define BMT_ENUMS_H

enum class SNU_BMT_Dataset
{
    imagenet2012,//Image classification --> resnet50-v1.5
    openimages_resized_to_800x800,//Object Detection --> retinanet 800x800
};

enum class SNU_BMT_Scenario
{
    SingleStream,
    Offline,
};

enum class SNU_BMT_Task
{
    ImageClassification,
    ObjectDetection,
};



#endif // BMT_ENUMS_H
