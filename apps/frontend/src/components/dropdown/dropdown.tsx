import { useDropdownStyles } from './dropdown.styles';
import React, { useMemo, useEffect, useState } from 'react';
import { track, useEditor, useActions } from '@tldraw/tldraw';

// Mini Bar
import PlusIcon from '@mui/icons-material/Add';
import DownArrowIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import UpArrowIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import clsx from 'clsx';
import { ScaleOptions } from '../../context/ScaleContext';

export enum DropdownPosition {
  BOTTOM = 'bottom',
  TOP = 'top',
}
export interface IDropdownProps {
  placeholder: React.ReactNode;
  values: { [key: string]: React.ReactNode };
  selected?: string;
  onSelected?: (selected: string | ScaleOptions) => void;
  onAdd?: () => void;
  className?: string;
  position?: DropdownPosition;
  canAdd?: boolean;
  addText?: React.ReactNode;
}

const Dropdown = track(
  ({
    placeholder,
    values,
    selected,
    onSelected,
    onAdd,
    className,
    position = DropdownPosition.TOP,
    canAdd = true,
    addText,
  }: IDropdownProps): JSX.Element => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const editor = useEditor();
    const actions = useActions();
    const classes = useDropdownStyles(position);
    const isBottom = position === DropdownPosition.BOTTOM;

    const onItemSelect = (selected_value: string) => {
      if (onSelected) {
        onSelected(selected_value);
      }
    };

    const onItemAdd = () => {
      if (onAdd) {
        onAdd();
      }
    };
    return (
      <div
        className={clsx(classes.root, className)}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className={classes.text}>
          {selected ? values[selected] : placeholder}
        </div>
        <button className={classes.iconButton}>
          {isOpen ? (
            <UpArrowIcon className={classes.icon} />
          ) : (
            <DownArrowIcon className={classes.icon} />
          )}
        </button>
        {isOpen && (
          <div
            className={clsx(
              classes.dropdownPanel,
              isBottom && classes.dropdownPanelBottom
            )}
          >
            {canAdd && isBottom && (
              <div className={classes.dropdownPanelItem} onClick={onItemAdd}>
                {addText ? (
                  addText
                ) : (
                  <>
                    <PlusIcon className={classes.icon} /> Create
                  </>
                )}
              </div>
            )}
            {Object.keys(values).map((val_key) => (
              <div
                key={val_key}
                className={
                  val_key === selected
                    ? clsx(
                        classes.dropdownPanelItem,
                        classes.dropdownPanelItemSelected
                      )
                    : classes.dropdownPanelItem
                }
                onClick={() => onItemSelect(val_key)}
              >
                {values[val_key]}
              </div>
            ))}
            {canAdd && position === DropdownPosition.TOP && (
              <div className={classes.dropdownPanelItem} onClick={onItemAdd}>
                {addText ? (
                  addText
                ) : (
                  <>
                    <PlusIcon className={classes.icon} /> Create
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
);

export default Dropdown;
