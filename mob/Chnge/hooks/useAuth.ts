import {useEffect, useState} from 'react';
import {getAuth, onAuthStateChanged, User} from 'firebase/auth';

const auth = getAuth();
export function useAuth() {
  const [user, setUser] = useState<User | boolean>();

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
