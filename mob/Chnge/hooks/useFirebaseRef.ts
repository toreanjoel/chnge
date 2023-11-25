import {useEffect, useState} from 'react';
import {ref} from 'firebase/database';
import {FIREBASE_DB} from '../config/firebase';
import {useAuth} from './useAuth';

// we set the constant of url paths once
const USERS_PATH = 'users';
const PROFILE_PATH = 'profile';
const METADATA_PATH = 'metadata';
const HISTORY_PATH = 'users';

export function useDb() {
  const {user} = useAuth();

  function updateProfileRef() {
    if (!user) return false;
    return ref(FIREBASE_DB, `/${USERS_PATH}/${user.uid}/${PROFILE_PATH}`);
  }

  function getProfileRef() {
    if (!user) return false;
    return ref(FIREBASE_DB, `/${USERS_PATH}/${user.uid}/${PROFILE_PATH}`);
  }

  // Metadata
  function updateMetadataRef() {
    if (!user) return false;
    return ref(FIREBASE_DB, `/${USERS_PATH}/${user.uid}/${METADATA_PATH}`);
  }

  // function getMetadata() {
  //   return new Promise((resolve, reject) => {
  //     onValue(
  //       ref(FIREBASE_DB, `/${USERS_PATH}/${user?.uid}/${METADATA_PATH}`),
  //       snapshot => {
  //         snapshot.exists() ? resolve(snapshot.val()) : resolve({});
  //       },
  //       error => {
  //         reject(error);
  //       },
  //     );
  //   });
  // }

  // //Transactions
  // async function setCurrentTransactions(dateStr: string) {
  //   return 'test';
  // }

  // async function getCurrentTransactions(dateStr: string): Transactions {
  //   return 'test';
  // }

  // //Transaction history
  // function addTransactionitem(item: TransactionItem) {
  //   return 'test';
  // }

  return {
    updateProfile,
    getProfile,
    updateMetadata,
    getMetadata,
    // setCurrentTransactions,
    // getCurrentTransactions,
    // addTransactionitem,
  };
}
