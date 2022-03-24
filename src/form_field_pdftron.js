documentViewer.getAnnotationsLoadedPromise().then(() => {
    const fieldManager = annotationManager.getFieldManager()
    fieldManager.forEachField(async (field) => {
        field.setValue('rubeel');
    });
})