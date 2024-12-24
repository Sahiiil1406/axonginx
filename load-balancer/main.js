
class LoadBalancer {
    constructor(servers, algorithm,weights=[]) {
      this.servers = servers;
      this.algorithm = algorithm;
      this.currentIndex = 0; // For round-robin
      this.hash={}//hashmap for ip
      this.weight=weights//for weighted
      this.counter=0;//for weighted
    }
  
    getNextServer(ip) {
      switch (this.algorithm) {
        case 'round-robin':
          const server = this.servers[this.currentIndex];
          this.currentIndex = (this.currentIndex + 1) % this.servers.length;
          return server;
        
        case 'ip-hash':
            const present=this.hash[ip];
           // console.log(this.hash)
            if(present){return present;}else{
                this.hash[ip]=this.servers[this.currentIndex];
                this.currentIndex++;
                return this.servers[this.currentIndex-1];
            }
            
        case 'random':
            const n = this.servers[this.currentIndex];
            this.currentIndex =Math.floor(Math.random()*this.servers.length)
            return n;

        case 'weighted':
            //[asn1,a2,a3]:[2,2,1]
            
            if(this.counter==0){
                this.counter=this.weight[this.currentIndex++]-1;
            }else{
                this.counter--;
            }
            if(!this.servers[this.currentIndex-1]){
                this.currentIndex=0;
                this.counter=0;
                return this.servers[this.currentIndex];
            }
            return this.servers[this.currentIndex-1];

        default:
          throw new Error(`Unsupported algorithm: ${this.algorithm}`);
      }
    }
  }
// const x=new LoadBalancer(['a','b','c'],'round-robin');
// const y=new LoadBalancer(['a','b','c'],'random')
// const arr=[]
// arr.push(x)
// arr.push(y)
// console.log(arr[1].getNextServer());
// console.log(arr[1].getNextServer());
// console.log(arr[1].getNextServer());
// console.log(arr[1].getNextServer());
// console.log(arr[1].getNextServer());
// console.log(arr[1].getNextServer());



module.exports={
    LoadBalancer
};
  