import React, { useState, useEffect } from 'react';
import UserInfo from './UserInfo';
import TopBasicNavHeader from '../../components/Header/TopBasicNavHeader';
import PostPage from '../PostPage/PostPage';
import { getUserProfile, getMyPost, getUserPosts} from '../../utils/Apis';
import { useRecoilValue } from 'recoil';
import { tokenAtom, accountAtom } from '../../atoms/UserAtom';
import { useLocation } from 'react-router-dom';
import TabMenu from '../../components/Footer/TabMenu';



const ProfilePage = () => {
  const location = useLocation();
  const userToken = useRecoilValue(tokenAtom);
  const [posts, setPosts] = useState([]);
  const [profile, setProfile] = useState();
  const [accountName, setAccountName] = useState('');

   useEffect(() => {
    setAccountName(
      location.pathname.substring(location.pathname.lastIndexOf('/') + 1)
    );
  }, []);
  useEffect(() => {
    if (accountName) {
      const fetchData = async () => {
        try {
          await getProfile();
          await getPost();
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };
      fetchData();
    }
    }, [accountName]);

   const getProfile = async () => {
    try {
      const profileData = await getUserProfile(userToken, accountName);
      setProfile(profileData.profile);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };
  const getPost = async () => {
    try {
      const postData = await getMyPost(accountName, 10, 0);
      setPosts(postData.post);
    } catch (error) {
      console.error('Error fetching user posts:', error);
    }
  };
  return (
    <>
      {console.log(profile)}
      <TopBasicNavHeader />
      {profile && (
        <UserInfo
          data={profile}
          myProfile={
            JSON.parse(localStorage.getItem('recoil-persist'))[
              'accountAtom'
            ] === accountName
          }
        />
      )}
      {posts.length > 0 &&
        posts.map((post, index) => <PostPage key={index} data={post} />)}
      <TabMenu />
    </>
  );
};
export default ProfilePage;