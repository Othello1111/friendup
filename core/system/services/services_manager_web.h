/*©mit**************************************************************************
*                                                                              *
* This file is part of FRIEND UNIFYING PLATFORM.                               *
* Copyright (c) Friend Software Labs AS. All rights reserved.                  *
*                                                                              *
* Licensed under the Source EULA. Please refer to the copy of the MIT License, *
* found in the file license_mit.txt.                                           *
*                                                                              *
*****************************************************************************©*/
/** @file
 * 
 *  Service Manager Web header
 *
 *  @author PS (Pawel Stefanski)
 *  @date created 2016
 */

#ifndef __SERVICES_SERVICES_MANAGER_WEB_H__
#define __SERVICES_SERVICES_MANAGER_WEB_H__

#include <system/services/service.h>
#include <network/socket.h>
#include <network/http.h>
#include <network/path.h>
#include "service_manager.h"

//
// Web calls handler, void *SystemBase
//

Http *ServicesManagerWebRequest( void *lsb, char **urlpath, Http* request, UserSession *loggedSession );

#endif //__SERVICES_SERVICES_MANAGER_H__
