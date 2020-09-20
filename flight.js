import pkg from 'ar-drone';
const { createClient } = pkg;
import { createServer } from 'http';

var client = createClient();

client.disableEmergency();
client
.after(5000, function(){
 this.front(0.2);
 this.right(0.2);
 this.counterClockwise(0.2);

})
.after(5000, function(){
   client.stop();
   client.land();
})
   
  

const server = createServer(function(req, res) {

});

server.listen(8080, function() {
  console.log('Ready for takeoff ...');
 
});
