import React, { useState } from 'react';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';

import SupportWindow from './SupportWindow';

import searchIcon from '../images/loupe.png';
import supportIcon from '../images/insurance.png';
import centerIcon from '../images/disabled-sign.png';

function BottomBar() {
  const [open, setOpen] = useState(false);

  const makeIcon = (src: string) => (
    <img
      src={src}
      style={{
        width: '32px',
        height: '32px',
      }}
    />
  );

  return (
    <>
      <SupportWindow open={open} onClose={() => setOpen(false)} />
      <BottomNavigation
        showLabels
        style={{
          height: '50px',
        }}
      >
        <BottomNavigationAction label={<span style={{ color: 'black' }}>Поиск</span>} icon={makeIcon(searchIcon)} />
        <BottomNavigationAction
          label={<span style={{ color: 'black' }}>Центрировать</span>}
          icon={makeIcon(centerIcon)}
        />
        <BottomNavigationAction
          label={<span style={{ color: 'black' }}>Тех. поддержка</span>}
          icon={makeIcon(supportIcon)}
          onClick={() => setOpen(true)}
        />
      </BottomNavigation>
    </>
  );
}

export default BottomBar;
