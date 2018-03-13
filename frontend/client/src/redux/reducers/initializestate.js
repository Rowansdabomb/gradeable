import axios from 'axios';
import newteststate from './newteststate';

axios.post('/api/teststate', {
  testId: String(this.props.testId),
}).then((result) => {
  console.log(result);
});