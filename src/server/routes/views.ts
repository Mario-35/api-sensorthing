import { keyString } from "../constant";
export class CreateHtml {
    private head = (title: string): string => {
        return `
      <head>
      <meta charset="utf-8">
      <style>${this.css()}</style>
      <title>${title}</title>
      </head>`;
    };

    private foot = (
        links: {
            href: string;
            class: string;
            name: string;
        }[]
    ): string => {
        return `<div class="hr"></div> <div id="outer"> <div class="inner"> <a href="${links[0].href}" class="${links[0].class}" >${links[0].name}</a> </div> <div class="inner"> <a href="${links[1].href}" class="${links[1].class}" >${links[1].name}</a> </div>  
        `;
    };
    public login = (datas: { login: boolean; body?: any; why?: keyString }): string => {
        const alert = (name: string): string => {
            return datas.why && datas.why[name] ? `<div class="alert">${datas.why[name]}</div>` : "";
        };
        return `<!DOCTYPE html>
    <html>
      ${this.head("Login")}
    
     <body>
        <div class="login-wrap">
          <div class="login-html">
            <input id="tab-1" type="radio" name="tab" class="sign-in" ${datas.login ? "checked" : ""}><label for="tab-1" class="tab">Sign In</label>
            <input id="tab-2" type="radio" name="tab" class="sign-up" ${datas.login ? "" : "checked"}><label for="tab-2" class="tab">Sign Up</label>
            <div class="login-form">
              <form action="/login" method="post">
                <div class="sign-in-htm">
                  <div class="group">
                    <label for="user" class="label">Username</label>
                    <input id="user" name="username" type="text" class="input">
                  </div>
                  <div class="group">
                    <label for="pass" class="label">Password</label>
                    <input id="pass" name="password" type="password" class="input" data-type="password">
                  </div>
                  <div class="group">
                    <input id="check" type="checkbox" class="check" checked>
                    <label for="check"><span class="icon"></span> Keep me Signed in</label>
                  </div>
                  <div class="group">
                    <input type="submit" class="button" value="Sign In">
                  </div>
                  <div class="hr"></div>
                  <div class="foot-lnk">
                    <a href="#forgot">Forgot Password?</a>
                  </div>
                </div>
              </form>
    
              <form action="/register" method="post">
                <div class="sign-up-htm">
                  <div class="group">
                    <label for="user" class="label">Username</label>
                    <div class='tooltip help'>
                      <span>?</span>
                      <div class='content'>
                        <b></b>
                        <p>Name must be at least 2 words</p>
                      </div>
                    </div>
                    <input id="regusername" type="text" name="username" class="input" value="${datas.body && datas.body.username ? datas.body.username : ""}">
                    ${alert("username")}
                  </div>
                  <div class="group">
                    <label for="pass" class="label">Password</label>
                    <div class='tooltip help'>
                      <span>?</span>
                      <div class='content'>
                        <b></b>
                        <p>At least one number, one lowercase and one uppercase letter, at least six characters that are letters, numbers or the
                        underscore</p>
                      </div>
                    </div>
                    <input id="regpass" type="password" name="password" class="input" data-type="password" value="${
                        datas.body && datas.body.password ? datas.body.password : ""
                    }">
                    ${alert("password")}
                  </div>
                  <div class="group">
                    <label for="pass" class="label">Repeat Password</label>
                    <div class='tooltip help'>
                      <span>?</span>
                      <div class='content'>
                        <b></b>
                        <p>Same as password</p>
                      </div>
                    </div>
                    <input id="regrepeat" type="password" name="repeat" class="input" data-type="password" value="${
                        datas.body && datas.body.repeat ? datas.body.repeat : ""
                    }">
                    ${alert("repeat")}
                  </div>
                  <div class="group">
                    <label for="pass" class="label">Email Address</label>
                    <div class='tooltip help'>
                      <span>?</span>
                      <div class='content'>
                        <b></b>
                        <p>A valid email address</p>
                      </div>
                    </div>
                    <input id="regmail" type="text" name="email" class="input" value="${datas.body && datas.body.email ? datas.body.email : ""}">
                    ${alert("email")}
                  </div>
    
                  <div class="group">
                    <input type="submit" class="button" value="Sign Up">
                  </div>
                  <div class="hr"></div>
                  
                  <div class="foot-lnk">
                    <label for="tab-1">Already Member?</a>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
    </body>s
    
    </html>
    `;
    };

    public status = (datas: { host: string; username: string; admin: string; database: string }): string => {
        return `<!DOCTYPE html>
    <html>
      ${this.head("Status")}
      <body>
        <div class="login-wrap">
          <div class="login-html">         
            <h2>You are authenticated.</h2>        
            <div class="hr"></div>
            
            <h3>Username : ${datas.username}</h3>
            <h3>Hosting : ${datas.host}</h3>
            <h3>Database : ${datas.database}</h3>
            <h3>Status : ${datas.admin}</h3>
            
            ${this.foot([
                { href: "/Logout", class: "button-logout", name: "Logout" },
                { href: "/Query", class: "button", name: "Query" }
            ])}
          </div>
        </div>
      </body>
    </html>
    `;
    };

    public error = (message: string): string => {
        return `<!DOCTYPE html>
    <html>
    
       ${this.head("Error")}
    
      <body>
        <div class="login-wrap">
          <div class="login-html">         
            <h1>Error.</h1>        
            <div class="hr"></div>
            
            <h3>On error page</h3>
            <h3>${message}</h3>

            <div class="hr"></div>
    
            <div id="outer">
              <div class="inner">
              <a href="/Login" class="button-submit" >Login</a>
            </div>
    
            <div class="inner">
              <a href="/Query" class="button" >query</a>
            </div>
          </div>
        </div>
      </body>
    
    </html>`;
    };

    private css = () => {
        return 'body{margin:0;color:#6a6f8c;background:#c8c8c8;font:600 16px/18px "Open Sans",sans-serif}*,:after,:before{box-sizing:border-box}.nothing{display:none}.clearfix:after,.clearfix:before{content:"";display:table}.clearfix:after{clear:both;display:block}a{color:inherit;text-decoration:none}.login-wrap{width:100%;margin:auto;max-width:525px;min-height:670px;position:relative;box-shadow:0 12px 15px 0 rgba(0,0,0,.24),0 17px 50px 0 rgba(0,0,0,.19)}.login-html{width:100%;height:100%;position:absolute;padding:90px 70px 50px 70px;background:rgba(40,57,101,.9)}.login-html .sign-in-htm,.login-html .sign-up-htm{top:0;left:0;right:0;bottom:0;position:absolute;transform:rotateY(180deg);backface-visibility:hidden;transition:all .4s linear}.login-form .group .check,.login-html .sign-in,.login-html .sign-up{display:none}.login-form .group .button,.login-form .group .label,.login-html .tab{text-transform:uppercase}.login-html .tab{font-size:22px;margin-right:15px;padding-bottom:5px;margin:0 15px 10px 0;display:inline-block;border-bottom:2px solid transparent}.login-html .sign-in:checked+.tab,.login-html .sign-up:checked+.tab{color:#fff;border-color:#1161ee}.login-form{min-height:345px;position:relative;perspective:1000px;transform-style:preserve-3d}.login-form .group{margin-bottom:15px}.login-form .group .button,.login-form .group .input,.login-form .group .label{width:95%;color:#fff;display:block}.login-form .group .button,.login-form .group .input{border:none;padding:15px 20px;border-radius:25px;background:rgba(255,255,255,.1)}.login-form .group input[data-type=password]{text-security:circle;-webkit-text-security:circle}.login-form .group .label{color:#aaa;font-size:12px}.login-form .group .button{background:#1161ee}.login-form .group label .icon{width:15px;height:15px;border-radius:2px;position:relative;display:inline-block;background:rgba(255,255,255,.1)}.login-form .group label .icon:after,.login-form .group label .icon:before{content:"";width:10px;height:2px;background:#fff;position:absolute;transition:all .2s ease-in-out 0s}.login-form .group label .icon:before{left:3px;width:5px;bottom:6px;transform:scale(0) rotate(0)}.login-form .group label .icon:after{top:6px;right:0;transform:scale(0) rotate(0)}.login-form .group .check:checked+label{color:#fff}.login-form .group .check:checked+label .icon{background:#1161ee}.login-form .group .check:checked+label .icon:before{transform:scale(1) rotate(45deg)}.login-form .group .check:checked+label .icon:after{transform:scale(1) rotate(-45deg)}.login-html .sign-in:checked+.tab+.sign-up+.tab+.login-form .sign-in-htm{transform:rotate(0)}.login-html .sign-up:checked+.tab+.login-form .sign-up-htm{transform:rotate(0)}.hr{height:2px;margin:60px 0 50px 0;background:rgba(255,255,255,.2)}.foot-lnk{text-align:center}.button-logout{background-color:#ea61b6;border-radius:6px;color:#fff;display:block;letter-spacing:1px;padding:8px 12px;text-align:center;text-decoration:none;text-transform:uppercase;transition:all .6s ease}.button-logout:hover{background-color:#cc2111;box-shadow:0 24px 48px rgba(0,0,0,.3);transform:scale(1.1,1.1)}.button{display:inline-block;background-color:#61b4ea;border-radius:6px;color:#fff;display:block;letter-spacing:1px;padding:8px 12px;text-align:center;text-decoration:none;text-transform:uppercase;transition:all .6s ease}.button:hover{background-color:#115fcc;box-shadow:0 24px 48px rgba(0,0,0,.3);transform:scale(1.1,1.1)}.button-submit{background-color:#61ea9f;border-radius:6px;color:#fff;display:block;letter-spacing:1px;padding:8px 12px;text-align:center;text-decoration:none;text-transform:uppercase;transition:all .6s ease}.button-submit:hover{background-color:#11cc21;box-shadow:0 24px 48px rgba(0,0,0,.3);transform:scale(1.1,1.1)}#outer{width:100%;text-align:center}.inner{display:inline-block;width:35%}.tooltip{float:right;top:2px;left:7px;position:relative;z-index:2}.tooltip:hover{z-index:3}.tooltip>span{display:inline-block;width:15px;height:15px;line-height:15px;font-size:.9em;font-weight:700;text-align:center;color:#fff;cursor:help;background-color:#00aeef;position:relative;border-radius:10px}.tooltip .content{opacity:0;width:200px;background-color:#333;color:#fff;font-size:.7em;position:absolute;top:0;left:20px;padding:8px;border-radius:6px;pointer-events:none;transition:.2s cubic-bezier(.1,.1,.25,2);-webkit-transition:.3s cubic-bezier(.1,.2,.5,2.2);-moz-transition:.3s cubic-bezier(.1,.2,.5,2.2)}.tooltip p{padding:0}.tooltip.down .content{left:auto;right:0;top:30px}.tooltip:hover .content{opacity:1;left:36px}.tooltip .content b{height:0;width:0;border-color:#333 #333 transparent transparent;border-style:solid;border-width:9px 7px;position:absolute;left:-14px;top:8px}.tooltip.down .content b{left:auto;right:6px;top:-10px;border-width:5px;border-color:transparent #333 #333 transparent}.alert{float:right;margin:-25px 0 0 375px;padding:3px 10px;color:#fff;font-size:.7em;border-radius:3px 4px 4px 3px;background-color:#ce5454;max-width:370px;white-space:pre;position:absolute;left:-15px;opacity:0;z-index:1;transition:.15s ease-out}.alert::after{content:"";display:block;height:0;width:0;border-color:transparent #ce5454 transparent transparent;border-style:solid;border-width:11px 7px;position:absolute;left:-13px;top:1px}.alert{left:0;opacity:1}';
    };
}
