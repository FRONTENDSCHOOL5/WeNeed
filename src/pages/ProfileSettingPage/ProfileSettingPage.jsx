import React, { useRef, useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import BasicProfileImg from '../../assets/images/basic-profile-l.svg';

import Input from '../../components/common/Input/Input';
import ButtonContainer from '../../components/common/Button/ButtonContainer';

import {
  postAccountnameDuplicate,
  postUserSignup,
  postUploadProfile,
} from '../../utils/Apis';

import {
  Container,
  Title,
  ImageWrap,
  Form,
  Image,
  ImageInput,
  ErrorMsg,
} from './ProfileSettingPageStyle';
const ProfileSettingPage = () => {
  const URL = 'https://api.mandarin.weniv.co.kr/';

  const navigate = useNavigate();
  const fileInputRef = useRef();
  const location = useLocation();
  const userEmail = location.state.email;
  const userPassword = location.state.password;

  const [username, setUsername] = useState('');
  const [accountname, setAccountname] = useState('');
  const [intro, setIntro] = useState('');
  const [image, setImage] = useState('');
  const [usernameErrorMsg, setUsernameErrorMsg] = useState('');
  const [accountnameErrorMsg, setAccountnameErrorMsg] = useState('');
  const [usernameValid, setUsernameValid] = useState(false);
  const [accountnameValid, setAccountnameValid] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const formData = new FormData();

  const handleInputImage = async (e) => {
    const file = e.target.files[0];
    formData.append('image', file);
    const imgData = await postUploadProfile(formData);
    console.log(imgData);
    setImage(URL + '/' + imgData.filename);
  };

  const handleInputChange = (e) => {
    const intro = e.target.value;
    setIntro(intro);
  };

  // username 유효성 검사
  const handleInputUsername = (e) => {
    const username = e.target.value;
    const usernameRegex = /^[a-zA-Z0-9]{2,10}$/;
    if (username === '') {
      setUsernameErrorMsg('*입력해주세요');
    } else if (!usernameRegex.test(username)) {
      setUsernameErrorMsg('*영문 2~10자 이내로 입력해주세요');
    } else {
      setUsernameErrorMsg('');
      setUsernameValid(true);
      setUsername(username);
    }
  };

  // accountname 유효성 검사
  const handleInputAccountname = async (e) => {
    const accountname = e.target.value;
    const accountnameRegex = /^[a-zA-Z0-9._]+$/;
    const checkAccountname = await postAccountnameDuplicate(accountname);
    if (accountname === '') {
      setAccountnameErrorMsg('*입력해주세요');
      setAccountnameValid(false);
    } else if (!accountnameRegex.test(accountname)) {
      setAccountnameErrorMsg('*영문, 숫자, 특수문자 ., _ 만 입력해주세요');
      setAccountnameValid(false);
    } else if (checkAccountname.message === '이미 가입된 계정ID 입니다.') {
      setAccountnameErrorMsg('*이미 존재하는 계정ID 입니다 😥');
      setAccountnameValid(false);
    } else {
      setAccountnameValid(true);
      setAccountnameErrorMsg('');
      setAccountname(accountname);
    }
  };

  /* 버튼 활성화 */
  const handleActivateButton = () => {
    return usernameValid && accountnameValid;
  };

  /* 에러 메시지 초기화 */
  useEffect(() => {
    setUsernameErrorMsg('');
  }, [username]);

  useEffect(() => {
    setAccountnameErrorMsg('');
  }, [accountname]);

  const handleProfileSignup = async (e) => {
    e.preventDefault();
    if (usernameValid && accountnameValid) {
      const signupData = await postUserSignup(
        username,
        userEmail,
        userPassword,
        accountname,
        intro,
        image
      );
      setIsComplete(true);
      console.log(signupData);
      navigate('/login');
    } else {
      setIsComplete(false);
    }
  };

  return (
    <>
      <Container>
        <Title>프로필 설정</Title>
        <p className="profileSetting-description">
          나중에 언제든지 변경할 수 있습니다.
        </p>
        <Form onSubmit={handleProfileSignup}>
          <ImageWrap>
            <label htmlFor="upload-image">
              <Image
                src={image ? image : BasicProfileImg}
                alt="사용자 프로필 이미지"
              />
            </label>
            <ImageInput
              type="file"
              accept="image/png, image/jpg, image/jpeg"
              id="upload-image"
              ref={fileInputRef}
              onChange={handleInputImage}
            />
          </ImageWrap>
          <Input
            label="사용자 이름"
            placeholder="2~10자 이내여야 합니다."
            id="username"
            type="text"
            name="username"
            onChange={handleInputUsername}
            hasError={usernameErrorMsg !== ''}
            required
          />
          {usernameErrorMsg && <ErrorMsg>{usernameErrorMsg}</ErrorMsg>}
          <Input
            label="계정 ID"
            placeholder="영문, 숫자, 특수문자(.),(_)만 사용 가능합니다."
            id="accountname"
            type="text"
            name="accountname"
            onChange={handleInputAccountname}
            hasError={accountnameErrorMsg !== ''}
            required
          />
          {accountnameErrorMsg && <ErrorMsg>{accountnameErrorMsg}</ErrorMsg>}
          <div className="button-margin">
            <Input
              label="소개"
              placeholder="자신에 대해 소개해 주세요!"
              id="intro"
              type="text"
              name="intro"
              onChange={handleInputChange}
              required
            />
          </div>
          <ButtonContainer
            type={'L'}
            text={'들숨날숨 시작하기'}
            isDisabled={!handleActivateButton()}
            handleClick={handleProfileSignup}
          />
        </Form>
      </Container>
    </>
  );
};

export default ProfileSettingPage;
