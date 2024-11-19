const ESIGN_REQUIRED_FIELD_COLOR = "#FD3C3C";

const ESIGN_DEFAULT_DATE_FORMAT = "mmm dd, yyyy";

const ESIGN_FONT_STYLES = {
  LIGHT: "light",
  REGULAR: "normal",
  BOLD: "bold",
  ITALIC: "italic"
};

const ESIGN_DEFAULT_FONT_STYLE = ESIGN_FONT_STYLES.REGULAR;

const ESIGN_DEFAULT_FONT_SIZE = 14;

const ESIGN_DEFAULT_FONT_NAME = "sans-serif";

const FIELD_TYPES = {
  SIGNATURE: "SIGNATURE",
};

const TOOLS = {
  signature: {
      id: "signature",
      label: "signature",
      type: FIELD_TYPES.SIGNATURE,
      sizeType: FIELD_TYPES.SIGNATURE,
      enabled: true,
      height: {
          default: 64,
          min: 48,
          max: 88
      },
      width: {
          default: 160,
          min: 87,
          max: 200
      }
  },
};

const ESIGN_NAMESPACE = "egnyteESign";

function getRichStyleForAnnotation(style) {
  // regular
  const richStyle = {
      "font-style": "normal",
      "font-weight": "normal"
  };

  if (style === ESIGN_FONT_STYLES.BOLD) {
      richStyle["font-weight"] = "bold";
  } else if (style === ESIGN_FONT_STYLES.ITALIC) {
      richStyle["font-style"] = "italic";
  } else if (style === ESIGN_FONT_STYLES.LIGHT) {
      richStyle["font-weight"] = "300";
  }

  return richStyle;
}

const eSignerBlue = "rgba(96, 122, 184, 1)";
const eSignerBlueBg = "rgba(96, 122, 184, 0.1)";

const parseToRgbA = color =>
  color
      .replace("rgb(", "")
      .replace("rgba(", "")
      .replace(")", "")
      .split(",")
      .map(c => parseFloat(c));


export async function addSetupField({
  tool = TOOLS.signature,
  instance,
  point = {},
  flag = {},
  fontName = ESIGN_DEFAULT_FONT_NAME,
  fontSize = ESIGN_DEFAULT_FONT_SIZE,
  fontStyle = ESIGN_DEFAULT_FONT_STYLE,
}) {
  const fillColor = parseToRgbA(eSignerBlueBg) ?? [0, 0, 0, 0];
  const textColor = parseToRgbA(eSignerBlue) ?? [0, 0, 0, 1];
  const uniqueId = `${ESIGN_NAMESPACE}:${tool.id}:${Date.now()}`;
  const required = true;
  const custom = {
      ...tool,
      id: uniqueId,
      name: uniqueId,
      displayName: "test",
      email: "abc@abc.com",
      placeholderName: "test",
      dateFormat: ESIGN_DEFAULT_DATE_FORMAT,
      required,
      fontName,
      fontSize,
      fontStyle,
      options: [],
      defaultOption: "",
      isSetupField: true,
      isPlaceholder: false
  };

  const { documentViewer, annotationManager, Annotations } = instance.Core;

  annotationManager.disableReadOnlyMode();

  const doc = documentViewer.getDocument();
  const displayMode = documentViewer.getDisplayModeManager().getDisplayMode();
  const page = displayMode.getSelectedPages(point, point);
  const zoom = documentViewer.getZoomLevel();

  if (!!point.x && page.first === null) {
      return;
  }

  const pageIdx = page.first !== null ? page.first : documentViewer.getCurrentPage();
  const pageInfo = doc.getPageInfo(pageIdx);
  const pagePoint = displayMode.windowToPage(point, pageIdx);

  const textAnnot = new Annotations.FreeTextAnnotation(Annotations.FreeTextAnnotation.Intent.FreeText);


  textAnnot.PageNumber = pageIdx;
  textAnnot.Height =  tool.height.default;
  textAnnot.Width =  tool.width.default;
  textAnnot.IsHoverable = true;

  textAnnot.X = (pagePoint.x || pageInfo.width / 2) - textAnnot.Width / 2;
  textAnnot.Y = (pagePoint.y || pageInfo.height / 2) - textAnnot.Height / 2;

  textAnnot.setPadding(new Annotations.Rect(0, 0, 0, 0));
  textAnnot.custom = { flag, ...custom };

  // set the type of annot
  textAnnot.setContents(textAnnot.custom.displayName);
  textAnnot.FontSize = `${fontSize / zoom}px`;
  textAnnot.FontName = fontName;
  textAnnot.FillColor = new Annotations.Color(...fillColor);
  textAnnot.TextColor = new Annotations.Color(...textColor);
  textAnnot.StrokeThickness = 4;
  textAnnot.StrokeColor = new Annotations.Color(...fillColor);
  textAnnot.TextAlign = "left";
  textAnnot.TextVerticalAlign = "left";
  textAnnot.NoRotate = true;
  textAnnot.RotationControlEnabled = false;
  textAnnot.Author = annotationManager.getCurrentUser();
  textAnnot.disableRotationControl();
  await annotationManager.addAnnotation(textAnnot);
  await annotationManager.redrawAnnotation(textAnnot);

  textAnnot.setRichTextStyle({
      0: {
          color: required ? ESIGN_REQUIRED_FIELD_COLOR : textAnnot.TextColor.toHexString()
      },
      1: {
          color: textAnnot.TextColor.toHexString()
      }
  });

  const richStyle = getRichStyleForAnnotation(fontStyle);

  textAnnot.updateRichTextStyle(richStyle);

  annotationManager.deselectAllAnnotations();
  annotationManager.selectAnnotation(textAnnot);
}
