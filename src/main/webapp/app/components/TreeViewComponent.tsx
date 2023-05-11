import * as React from 'react';
import {FunctionComponent, useEffect, useRef, useState} from 'react';
import {Button, FormControlLabel, Checkbox, Box, Stack} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

export interface IMyComponentProps {
  items: any;
  onClick?: (values, id, checked) => void;
}

export const TreeViewComponent: FunctionComponent<IMyComponentProps> = (props: IMyComponentProps) => {

  const findAndUpdate = (items, id, checkedValue) => {
    const newItems = items.map((item) => {
      if (item.id === id) {
        return {...item, checked: checkedValue};
      } else if (item.child && item.child.length > 0) {
        // Recursive call should be inside the condition where the item has children
        return {...item, child: findAndUpdate(item.child, id, checkedValue)};
      } else {
        return {...item};
      }
    });

    return newItems;
  };

  const handleChange = (event) => {
    const id = event.target.value;
    const checked = event.target.checked;

    const newItems = findAndUpdate(props.items, id, checked);

    props.onClick(newItems, id, checked);
  };

  const Child = ({items}) => {
    return (
      <>
        <Box sx={{display: 'flex', flexDirection: 'column', ml: 2}}>
         <Stack direction="column">
          {items.child.map((item: any, index: number) => {

            return (<> <Stack direction="row">
                <FormControlLabel
                  label={item.label}
                  control={<Checkbox value={item.id} checked={item.checked}
                                     onChange={handleChange}/>}
                />
                <ArrowDropDownIcon sx={{marginTop: '8px'}}/>
              </Stack>
                {(item.child && item.child.length > 0) && <Child items={item}/>}
              </>
            )

          })}
         </Stack>
        </Box>

      </>
    )
  };

  const Root = ({label, id, checked, items}) => {
    return (
      <>
        <Stack direction="row">
          <FormControlLabel
            label={label}
            control={
              <Checkbox
                value={id}
                checked={checked}
                indeterminate={checked[0] !== checked[1]}
                onChange={handleChange}
              />
            }
          />
          <ArrowDropDownIcon sx={{marginTop: '8px'}}/>
        </Stack>
        {(items.child && items.child.length > 0) && <Child items={items}/>}
      </>
    )
  }

  return (
    <Box sx={{ overflow: 'auto', height: '300px'}}>
      {props.items && props.items.map((item: any, index: number) => {
        return (
          <Root checked={item.checked} id={item.id} label={item.label} items={item}/>
        )
      })}
    </Box>
  );
};
