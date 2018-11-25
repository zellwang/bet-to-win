//method func declaration to vm
extern "C" {
  int reguser();
  int getuser();
  int dobet();
}

//@abi action reguser
struct UserInfo{
  char userName[20];
  uint64_t amount;
  uint64_t win;
  uint64_t lose;
};

//@abi action getuser
struct UserBrief{
  char userName[20];
};

//@abi action dobet
struct BetInfo{
  char userName[20];
  char winOrLose[20];
  uint64_t amount;
};

//@abi table userdetail:[index_type:string, key_names:userName, key_types:string]
struct UserDetail{
  uint64_t amount;
  uint64_t win;
  uint64_t lose;
};
