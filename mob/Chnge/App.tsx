import React, {useEffect} from 'react';
import Auth from './screens/Auth';
import BootSplash from 'react-native-bootsplash';

function App(): JSX.Element {
  useEffect(() => {
    const init = async () => {
      // …do multiple sync or async tasks
    };

    init().finally(async () => {
      await BootSplash.hide({fade: true});
      console.log('BootSplash has been hidden successfully');
    });
  }, []);

  return <Auth />;
}

export default App;
