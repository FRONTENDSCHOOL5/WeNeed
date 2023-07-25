import React from 'react';
import HeaderContainer from './HeaderContainer';
import BackButton from './BackButton';
import GlovalSprite from '../../assets/sprite/GlovalSprite';
import { BackAndUserText, User } from './HeaderStyle';

const TopChatNavHeader = ({ text }) => {
  return (
    <HeaderContainer>
      <BackAndUserText>
        <BackButton />
        <User>{text}</User>
      </BackAndUserText>
      <button>
        <GlovalSprite id={'s-icon-more-vertical'} color={'white'} />
      </button>
    </HeaderContainer>
  );
};

export default TopChatNavHeader;
