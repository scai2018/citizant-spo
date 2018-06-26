// import { Component } from '@angular/core';

export var global = {
    authResult: null,
    ver: 1,
    activitesListID: 'da7cd400-0cd9-4dde-9167-3049747f195a',
    mock: 1,

    /*
  SCAI NOTE: 
  1) Able to see the login page on AAD, but the tenant was wrong. Change to use :
    authority: https://login.windows.net/citizant.onmicrosoft.com
    resource: https://graph.windows.net
    client ID: a0ac5fdd-442b-416c-9c4b-aefe509de5c7
    reply URL: http://localhost:8100
    tenant: citizant.onmicrosoft.com, 

*/
    /* Ver 1.0:   */
    //authority1: 'https://login.windows.net/citizant.onmicrosoft.com',
    authority1: 'https://login.windows.net/common',
    //resourceUrl1: 'https://graph.windows.net', // not used as has no list support

    /* Ver 2.0:  */
    authority2: "https://login.microsoftonline.com/common",
    //authority2: 'https://login.microsoft.com/common',
    resourceUrl2: 'https://graph.microsoft.com',

    clientId: 'a0ac5fdd-442b-416c-9c4b-aefe509de5c7',
    redirectUrl: 'http://localhost:8100'


};


// @Component({
//     providers: [CommonMethods]
//  })
export class CommonMethods {
    public static setHtml(elementName, html) {
        var element = document.getElementById(elementName);
        if (element) {
            element.innerHTML = html;
            console.log("Set " + elementName + ":" + html);
        } else {
            console.log("unable to set " + elementName + ":" + html);
        }
        return html;
    }
};