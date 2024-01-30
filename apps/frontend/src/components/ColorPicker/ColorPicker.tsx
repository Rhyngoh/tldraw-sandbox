import React, { useEffect, useMemo, useState } from 'react';
import { useColorPickerStyle } from './ColorPicker.styles';
import clsx from 'clsx';
import { ColorChangeHandler, ColorResult, SketchPicker } from 'react-color';
import { DefaultColors } from './DefaultColors';
import { PresetColor } from 'react-color/lib/components/sketch/Sketch';
interface Props {
  color: string;
  handleChange: (color: string) => void;
}
const ColorPicker = (props: Props) => {
  const { color, handleChange } = props;
  const classes = useColorPickerStyle();
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [colorValue, setColorValue] = useState(color);
  const defaultColors = Object.entries(DefaultColors).map(
    ([name, color]: [string, string]): PresetColor => {
      return { color: color, title: name };
    }
  );
  const handleClick = () => {
    if (showColorPicker) {
      handleChange(colorValue);
    }
    setShowColorPicker(!showColorPicker);
  };
  const handleColorChange = (
    color: ColorResult,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setColorValue(color.hex);
  };
  const colorValueToHex = useMemo(
    () => (colorValue.includes('#') ? colorValue : DefaultColors[colorValue]),
    [colorValue]
  );
  return (
    <div
      className={classes.container}
      onClick={handleClick}
      style={{ backgroundColor: colorValueToHex }}
    >
      <div className={classes.colorValue} title={`${colorValueToHex}`} />
      {showColorPicker ? (
        <>
          <div className={clsx(classes.cover)} />
          <div className={clsx(classes.popover)}>
            <div onClick={(e) => e.stopPropagation()}>
              <SketchPicker
                presetColors={defaultColors}
                color={colorValue}
                onChange={handleColorChange}
              />
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default ColorPicker;
