import React, { useContext, useState } from 'react';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';

import SupportWindow from './SupportWindow';
import SearchWindow from './SearchWindow';
import { useMap } from '../hooks/useMap';

import searchIcon from '../images/loupe.png';
import supportIcon from '../images/insurance.png';
import centerIcon from '../images/disabled-sign.png';

function BottomBar() {
  const [supportOpen, setSupportOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const { center } = useMap();

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
      <SupportWindow open={supportOpen} onClose={() => setSupportOpen(false)} />
      <SearchWindow open={searchOpen} onClose={() => setSearchOpen(false)} />
      <BottomNavigation
        showLabels
        style={{
          height: '50px',
        }}
      >
        <BottomNavigationAction
          label={<span style={{ color: 'black' }}>Поиск</span>}
          icon={makeIcon(searchIcon)}
          onClick={() => setSearchOpen(true)}
        />
        <BottomNavigationAction
          label={<span style={{ color: 'black' }}>Центрировать</span>}
          icon={makeIcon(centerIcon)}
          onClick={() => center([56.276487139154376, 58.01634557093591])}
        />
        <BottomNavigationAction
          label={<span style={{ color: 'black' }}>Тех. поддержка</span>}
          icon={makeIcon(supportIcon)}
          onClick={() => setSupportOpen(true)}
        />
      </BottomNavigation>
    </>
  );
}

export default BottomBar;
