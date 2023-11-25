import {useEffect, useState} from 'react';
import {getAuth, onAuthStateChanged, UserInfo} from 'firebase/auth';
import {FIREBASE_AUTH} from '../config/firebase';

const auth = FIREBASE_AUTH;
export function useAuth() {
  const [user, setUser] = useState<UserInfo | boolean>();

  useEffect(() => {
    const authChanged = onAuthStateChanged(auth, userDetails => {
      if (userDetails) {
        setUser(userDetails);
      } else {
        setUser(false);
      }
    });

    return authChanged;
  }, []);

  return {
    user,
  };
}
