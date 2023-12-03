import React, {useEffect} from 'react';
import Auth from './screens/Auth';
import BootSplash from 'react-native-bootsplash';

function App(): JSX.Element {
  useEffect(() => {
    const init = async () => {
      // …do multiple sync or async tasks
    };

    init().finally(async () => {
      // hide spash screen
      await BootSplash.hide({fade: true});
    });
  }, []);

  return <Auth />;
}

export default App;
