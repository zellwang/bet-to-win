#include "contractcomm.hpp"
#include "game.hpp"
#include "string.hpp"
#include "types.h"


#define PARAM_MAX_LEN (2048)

#define ERROR_PACK_FAIL (1)
#define ERROR_UNPACK_FAIL (2)
#define ERROR_SAVE_DB_FAIL (3)
#define ERROR_METHOD_INVALID (4)
#define ERROR_GET_CONTRACT_NAME_FAIL (5)
#define ERROR_GET_DB_FAIL (6)


static bool unpack_struct(MsgPackCtx *ctx, UserInfo *info)
{
    uint32_t size = 0;
    UNPACK_ARRAY(4)

    UNPACK_STR(info, userName, (21))

    UNPACK_U64(info, amount)
    
    UNPACK_U64(info, win)

    UNPACK_U64(info, lose)

    return 1;
}

static bool unpack_struct(MsgPackCtx *ctx, UserBrief *info)
{
    uint32_t size = 0;
    UNPACK_ARRAY(1)

    UNPACK_STR(info, userName, (21))

    return 1;
}

static bool unpack_struct(MsgPackCtx *ctx, BetInfo *info)
{
    uint32_t size = 0;
    UNPACK_ARRAY(3)

    UNPACK_STR(info, userName, (21))

    UNPACK_STR(info, winOrLose, (21))

    UNPACK_U64(info, amount)

    return 1;
}

static bool unpack_struct(MsgPackCtx *ctx, UserDetail *info)
{
    uint32_t size = 0;
    UNPACK_ARRAY(3)

    UNPACK_U64(info, amount)

    UNPACK_U64(info, win)

    UNPACK_U64(info, lose)

    return 1;
}

static bool pack_struct(MsgPackCtx *ctx, UserDetail *info)
{
    PACK_ARRAY16(3)
    
    PACK_U64(info, amount)
    
    PACK_U64(info, win)

    PACK_U64(info, lose)

    return 1;
}

int reguser(){
    UserInfo userinfo = {{0}};
    UserDetail userDetail = {{0}};
    UserDetail data2 = {{0}};
    char tablename[20] = "userdetail";

    if ( !parseParam<UserInfo>(userinfo) )  return ERROR_UNPACK_FAIL;

    //strcpy(userDetail.userRole, userinfo.userRole);
    userDetail.amount = userinfo.amount;
    userDetail.win = userinfo.win;
    userDetail.lose = userinfo.lose;

    if (!saveData<UserDetail>(userDetail, tablename, userinfo.userName)) return ERROR_SAVE_DB_FAIL;

    return 0;
}

int getuser(){
    return 0;
}

int dobet(){
    char mycontract_name[20] = "";
    getCtxName(mycontract_name, sizeof(mycontract_name));    
    if (strlen(mycontract_name) <= 0)
    {
        myprints("ERROR: Get my contract name failed.");
        return ERROR_GET_CONTRACT_NAME_FAIL;
    }

    BetInfo betinfo = {{0}};
    UserDetail userDetail = {{0}};
    UserDetail data2 = {{0}};
    char tableName[20] = "userdetail";
    //char userName[20];

    if ( !parseParam<BetInfo>(betinfo) )  return ERROR_UNPACK_FAIL;
    //strcpy(userDetail.userName, userName);

    if (!getData<UserDetail>(mycontract_name, tableName, betinfo.userName, data2) ){
        //myprints("getData failed!");
        return ERROR_GET_DB_FAIL;
    }

    //user logic by me, need debug
    if (strcmp(betinfo.winOrLose,"win")==0){
        userDetail.amount = data2.amount + betinfo.amount;
        userDetail.win = data2.win + betinfo.amount;
        userDetail.lose = data2.lose;
    }else{
        userDetail.amount = data2.amount - betinfo.amount;
        userDetail.win = data2.win;
        userDetail.lose = data2.lose + betinfo.amount;
    }

    if (!saveData<UserDetail>(userDetail, tableName, betinfo.userName)) return ERROR_SAVE_DB_FAIL;

    return 0;
}







  
