function Z(e){window.enmity.plugins.registerPlugin(e)}const y=window.enmity.modules.common.Constants;window.enmity.modules.common.Clipboard,window.enmity.modules.common.Assets,window.enmity.modules.common.Messages,window.enmity.modules.common.Clyde,window.enmity.modules.common.Avatars;const D=window.enmity.modules.common.Native,n=window.enmity.modules.common.React;window.enmity.modules.common.Dispatcher;const $=window.enmity.modules.common.Storage,x=window.enmity.modules.common.Toasts,R=window.enmity.modules.common.Dialog;window.enmity.modules.common.Token;const N=window.enmity.modules.common.REST;window.enmity.modules.common.Settings,window.enmity.modules.common.Users;const O=window.enmity.modules.common.Navigation;window.enmity.modules.common.NavigationNative,window.enmity.modules.common.NavigationStack,window.enmity.modules.common.Theme,window.enmity.modules.common.Linking;const k=window.enmity.modules.common.StyleSheet;window.enmity.modules.common.ColorMap,window.enmity.modules.common.Components,window.enmity.modules.common.Locale,window.enmity.modules.common.Profiles,window.enmity.modules.common.Lodash,window.enmity.modules.common.Logger,window.enmity.modules.common.Flux,window.enmity.modules.common.SVG,window.enmity.modules.common.Scenes;const{components:o}=window.enmity;o.Alert,o.Button,o.FlatList;const ee=o.Image;o.ImageBackground,o.KeyboardAvoidingView,o.Modal,o.Pressable,o.RefreshControl;const te=o.ScrollView;o.SectionList,o.StatusBar,o.StyleSheet,o.Switch;const f=o.Text;o.TextInput,o.TouchableHighlight;const p=o.TouchableOpacity;o.TouchableWithoutFeedback,o.Touchable;const S=o.View;o.VirtualizedList,o.Form,o.FormArrow,o.FormCTA,o.FormCTAButton,o.FormCardSection,o.FormCheckbox;const U=o.FormDivider;o.FormHint,o.FormIcon,o.FormInput,o.FormLabel,o.FormRadio;const c=o.FormRow,C=o.FormSection;o.FormSelect,o.FormSubLabel;const ne=o.FormSwitch;o.FormTernaryCheckBox,o.FormText,o.FormTextColors,o.FormTextSizes;const P={byProps:(...e)=>window.enmity.modules.filters.byProps(...e),byName:(e,t)=>window.enmity.modules.filters.byName(e,t),byTypeName:(e,t)=>window.enmity.modules.filters.byTypeName(e,t),byDisplayName:(e,t)=>window.enmity.modules.filters.byDisplayName(e,t)};function G(...e){return window.enmity.modules.bulk(...e)}function z(...e){return window.enmity.modules.getByProps(...e)}window.enmity.modules.common;const Y=e=>{let t=0;for(let i in e)t++;return t};function l(e){return window.enmity.assets.getIDByName(e)}const g={Debug:l("debug"),Retry:l("ic_message_retry"),Failed:l("Small"),Cancel:l("ic_megaphone_nsfw_16px"),Add:l("add_white"),Delete:l("ic_message_delete"),Clear:l("ic_clear_all_24px"),Pencil:l("ic_pencil_24px"),Copy:l("toast_copy_link"),Open:l("ic_leave_stage"),Clipboard:l("pending-alert"),Debug_Command:{Sent:l("ic_application_command_24px"),Clock:l("clock")},Settings:{Toasts:{Context:l("toast_image_saved"),Settings:l("ic_selection_checked_24px")},Self:l("friends_toast_icon"),Share:l("share"),Robot:l("ic_robot_24px"),Commands:l("ic_profile_badge_bot_commands"),Debug:l("ic_rulebook_16px")}},M=e=>{x.open({content:`Copied ${e} to clipboard.`,source:g.Clipboard})},oe=e=>{let t=e.split(`
`).map(i=>{if(i!="")return`"${i.replaceAll(":",'":"').replace(" ","")}",`});return t[0]=`{${t[0]}`,t[Y(t)]=`${t[Y(t)]}}`,t=t.join(""),t=t.replaceAll("undefined",""),t=t.split("").reverse().join("").replace(",","").split("").reverse().join(""),t};async function ie(){try{let e=await $.getItem("device_list");if(e)return JSON.parse(e);let t=(await N.get("https://gist.githubusercontent.com/adamawolf/3048717/raw/1ee7e1a93dff9416f6ff34dd36b0ffbad9b956e9/Apple_mobile_device_types.txt")).text,i=oe(t);await $.setItem("device_list",i);let s=await $.getItem("device_list");return JSON.parse(s)}catch(e){console.warn(`[SpinsPlugins Local Error \u2014 Issue when getting devices: ${e}]`);return}}async function se(e,t,i){let s=await ie();return`**[${e}] Debug Information**
> **Plugin Version:** ${t}
> **Plugin Build:** ${i.split("-")[1]}
> **Discord Build:** ${D.InfoDictionaryManager.Version} (${D.InfoDictionaryManager.Build})
> **Software Version:** ${D.DCDDeviceManager.systemVersion}
> **Device:** ${s[D.DCDDeviceManager.device]}`}const{native:_}=window.enmity;function ae(){_.reload()}_.version,_.build,_.device,_.version;const re=z("transitionToGuild");async function le({manifest:e}){const t=`${e.sourceUrl}?${Math.floor(Math.random()*1001)}.js`,i=await(await N.get(t)).text;let s=i.match(/\d\.\d\.\d+/g),r=i.match(/patch\-\d\.\d\.\d+/g);return!s||!r?j(e.name,e.version):(s=s[0],r=r[0],s!=e.version?q(t,s,r.split("-")[1],e,!1):r!=e.build?q(t,s,r.split("-")[1],e,!0):j(e.name,e.version))}const q=(e,t,i,s,r)=>{const u=r?i:t;R.show({title:"Update found",body:`A newer ${r?"build":"version"} is available for ${s.name}. ${r?`
The version will remain at ${t}, but the build will update to ${i}.`:""}
Would you like to install ${r?`build \`${i}\``:`version \`${t}\``}  now?`,confirmText:"Update",cancelText:"Not now",onConfirm:()=>ce(e,u,s,r)})},j=(e,t)=>{console.log(`[${e}] Plugin is on the latest version, which is ${t}`),x.open({content:`${e} is on latest version (${t})`,source:g.Settings.Toasts.Settings})};async function ce(e,t,i,s){window.enmity.plugins.installPlugin(e,({data:r})=>{r=="installed_plugin"||r=="overridden_plugin"?R.show({title:`Updated ${i.name}`,body:`Successfully updated to ${s?"build":"version"} \`${t}\`. 
Would you like to reload Discord now?`,confirmText:"Yep!",cancelText:"Not now",onConfirm:()=>{ae()}}):R.show({title:"Error",body:`Something went wrong while updating ${i.name}.`,confirmText:"Report this issue",cancelText:"Cancel",onConfirm:()=>{re.openURL(`https://github.com/spinfal/enmity-plugins/issues/new?assignees=&labels=bug&template=bug_report.md&title=%5BBUG%5D%20${i.name}%20Update%20Error%3A%20${s?`b${t}`:`v${t}`}`)}})})}const F=window.enmity.modules.common.Components.General.Animated,[I,me]=G(P.byProps("transitionToGuild"),P.byProps("setString"));var ue=({manifest:e})=>{const t=k.createThemedStyleSheet({container:{paddingTop:30,paddingLeft:20,marginBottom:-5,flexDirection:"row"},text_container:{paddingLeft:15,paddingTop:5,flexDirection:"column",flexWrap:"wrap"},image:{width:75,height:75,borderRadius:10},main_text:{opacity:.975,letterSpacing:.25},header:{color:y.ThemeColorMap.HEADER_PRIMARY,fontFamily:y.Fonts.DISPLAY_BOLD,fontSize:25,letterSpacing:.25},sub_header:{color:y.ThemeColorMap.HEADER_SECONDARY,opacity:.975,fontSize:12.75}}),i=n.useRef(new F.Value(1)).current,s=()=>{F.spring(i,{toValue:1.1,duration:250,useNativeDriver:!0}).start()},r=()=>{F.spring(i,{toValue:1,duration:250,useNativeDriver:!0}).start()},u=()=>{I.openURL("https://spin.rip/")},v={transform:[{scale:i}]};return n.createElement(n.Fragment,null,n.createElement(S,{style:t.container},n.createElement(p,{onPress:u,onPressIn:s,onPressOut:r},n.createElement(F.View,{style:[v]},n.createElement(ee,{style:[t.image],source:{uri:"https://cdn.spin.rip/r/l9uevwe4ia0.jpg"}}))),n.createElement(S,{style:t.text_container},n.createElement(p,{onPress:()=>{I.openURL(e.sourceUrl)}},n.createElement(f,{style:[t.main_text,t.header]},e.name," ")),n.createElement(S,{style:{flexDirection:"row"}},n.createElement(f,{style:[t.main_text,t.sub_header]},"A plugin by"),n.createElement(p,{onPress:()=>{I.openURL("https://spin.rip/")}},n.createElement(f,{style:[t.main_text,t.sub_header,{paddingLeft:4,fontFamily:y.Fonts.DISPLAY_BOLD}]},e.authors[0].name))),n.createElement(S,{style:{flexDirection:"row"}},n.createElement(f,{style:[t.main_text,t.sub_header]},"Settings page by"),n.createElement(p,{onPress:()=>{I.openURL("https://github.com/acquitelol/")}},n.createElement(f,{style:[t.main_text,t.sub_header,{paddingLeft:4,fontFamily:y.Fonts.DISPLAY_BOLD}]},"Acquite <3"))),n.createElement(S,null,n.createElement(p,{style:{flexDirection:"row"},onPress:()=>{me.setString(`**${e.name}** v${e.version}`),M("plugin name and version")}},n.createElement(f,{style:[t.main_text,t.sub_header]},"Version:"),n.createElement(f,{style:[t.main_text,t.sub_header,{paddingLeft:4,fontFamily:y.Fonts.DISPLAY_BOLD}]},e.version," "))))))};const[de,H]=G(P.byProps("transitionToGuild"),P.byProps("setString"));var ge=({manifest:e,settings:t,hasToasts:i,section:s,commands:r})=>{const u=k.createThemedStyleSheet({bottom_padding:{paddingBottom:25},icon:{color:y.ThemeColorMap.INTERACTIVE_NORMAL},item:{color:y.ThemeColorMap.TEXT_MUTED},text_container:{display:"flex",flexDirection:"column"}}),[v,w]=n.useState(),[h,d]=n.useState();return n.createElement(n.Fragment,null,n.createElement(te,{onTouchStart:m=>{w(m.nativeEvent.pageX),d(m.nativeEvent.pageY)},onTouchEnd:m=>{v-m.nativeEvent.pageX<-100&&h-m.nativeEvent.pageY<40&&h-m.nativeEvent.pageY>-40&&O.pop()}},n.createElement(ue,{manifest:e}),s,r&&n.createElement(C,{title:"Plugin Commands"},r.map(m=>n.createElement(c,{label:`/${m.name}`,subLabel:m.description,leading:n.createElement(c.Icon,{style:u.icon,source:g.Settings.Commands}),trailing:c.Arrow,onPress:function(){H.setString(`/${m.name}`),M(`the command ${m.name}`)}}))),n.createElement(C,{title:"Utility"},i&&n.createElement(n.Fragment,null,n.createElement(c,{label:"Initialization Toasts",leading:n.createElement(c.Icon,{style:u.icon,source:g.Settings.Toasts.Context}),subLabel:`If available, show toasts when ${e.name} is starting`,trailing:n.createElement(ne,{value:t.getBoolean(`${e.name}-toastEnable`,!1),onValueChange:()=>{t.toggle(`${e.name}-toastEnable`,!1),x.open({content:`Successfully ${t.getBoolean(`${e.name}-toastEnable`,!1)?"enabled":"disabled"} initialization toasts.`,source:g.Settings.Toasts.Settings})}})}),n.createElement(U,null)),n.createElement(c,{label:"Copy Debug Info",subLabel:`Copy useful debug information of ${e.name} to clipboard.`,leading:n.createElement(c.Icon,{style:u.icon,source:g.Settings.Debug}),trailing:c.Arrow,onPress:async function(){H.setString(await se(e.name,e.version,e.build)),M("plugin debug information")}}),n.createElement(U,null),n.createElement(c,{label:"Clear Device List Cache",subLabel:"Remove the fetched device list storage. This will not clear Discord's or your iDevice's cache.",leading:n.createElement(c.Icon,{style:u.icon,source:g.Delete}),trailing:c.Arrow,onPress:async function(){await $.removeItem("device_list"),x.open({content:"Cleared device list storage.",source:g.Settings.Toasts.Settings})}})),n.createElement(C,{title:"Source"},n.createElement(c,{label:"Check for Updates",subLabel:`Check for any plugin updates for ${e.name}.`,leading:n.createElement(c.Icon,{style:u.icon,source:g.Copy}),trailing:c.Arrow,onPress:()=>{le({manifest:e})}}),n.createElement(U,null),n.createElement(c,{label:"Source",subLabel:`View ${e.name} source code`,leading:n.createElement(c.Icon,{style:u.icon,source:g.Open}),trailing:c.Arrow,onPress:()=>{de.openURL(`https://github.com/spinfal/enmity-plugins/tree/master/${e.name}`)}})),n.createElement(c,{style:u.bottom_padding,label:`Plugin Version: ${e.version}
Plugin Build: ${e.build.split("-").pop()}`})))},we="PetPet",he="1.0.6",ye="patch-1.0.13",fe="Generate a petpet gif from a given image",be=[{name:"spin",id:"308440976723148800"}],ve="#ff0069",pe="https://raw.githubusercontent.com/spinfal/enmity-plugins/master/dist/PetPet.js",W={name:we,version:he,build:ye,description:fe,authors:be,color:ve,sourceUrl:pe};function L(e,t,i,s){window.enmity.clyde.sendReply(e,t,i,s)}var X;(function(e){e[e.BuiltIn=0]="BuiltIn",e[e.Guild=1]="Guild",e[e.DM=2]="DM"})(X||(X={}));var T;(function(e){e[e.Chat=1]="Chat",e[e.User=2]="User",e[e.Message=3]="Message"})(T||(T={}));var V;(function(e){e[e.BuiltIn=0]="BuiltIn",e[e.BuiltInText=1]="BuiltInText",e[e.BuiltInIntegration=2]="BuiltInIntegration",e[e.Bot=3]="Bot",e[e.Placeholder=4]="Placeholder"})(V||(V={}));var J;(function(e){e[e.Role=1]="Role",e[e.User=2]="User"})(J||(J={}));var b;(function(e){e[e.SubCommand=1]="SubCommand",e[e.SubCommandGroup=2]="SubCommandGroup",e[e.String=3]="String",e[e.Integer=4]="Integer",e[e.Boolean=5]="Boolean",e[e.User=6]="User",e[e.Channel=7]="Channel",e[e.Role=8]="Role",e[e.Mentionnable=9]="Mentionnable",e[e.Number=10]="Number",e[e.Attachment=11]="Attachment"})(b||(b={}));var A;(function(e){e[e.ApplicationCommand=2]="ApplicationCommand",e[e.MessageComponent=3]="MessageComponent"})(A||(A={}));const Se={id:"petpet-command",name:"petpet",displayName:"petpet",description:"Generate a petpet gif from a given image",displayDescription:"Generate a petpet gif from a given image",type:T.Chat,inputType:V.BuiltInText,options:[{name:"url",displayName:"url",description:"The URL of the image to petpet",displayDescription:"The URL of the image to petpet",type:b.String,required:!1},{name:"user",displayName:"user",description:"Grab a user's avatar to petpet",displayDescription:"Grab a user's avatar to petpet",type:b.User,required:!1},{name:"size",displayName:"size",description:"Change the size of the petpet gif. Max is 512. Defaults to 100, higher values equal larger files and potentially no Discord embeds",displayDescription:"Change the size of the petpet gif. Max is 512. Defaults to 100, higher values equal larger files and potentially no Discord embeds",type:b.Integer,required:!1},{name:"delay",displayName:"delay",description:"The delay between each frame, defaults to 20",displayDescription:"The delay between each frame, defaults to 20",type:b.Integer,required:!1},{name:"whisper",displayName:"whisper",description:"Only you can see the result",displayDescription:"Only you can see the result",type:b.Boolean,required:!1}],execute:async function(e,t){var i,s,r,u,v;const w=e[e.findIndex(a=>a.name==="url")],h=e[e.findIndex(a=>a.name==="user")],d=e[e.findIndex(a=>a.name==="size")],m=e[e.findIndex(a=>a.name==="delay")],E=e[e.findIndex(a=>a.name==="whisper")],Q="v2";if(!w&&!h)return L((i=t==null?void 0:t.channel.id)!=null?i:"0","No argument provided, nothing will happen. Here's a banana instead \u{1F34C}");try{const a=await N.get(`https://petpet-api.clit.repl.co/petpet?url=${w!=null&&w.value?w.value:z("getUser").getUser(h==null?void 0:h.value).getAvatarURL().split("?")[0].replace(/gif|webp/,"png")}&size=${d?d.value:100}&delay=${m?m.value:20}&version=${Q}`).then(B=>B.body);if(a.status==!0){const B={type:"rich",image:{proxy_url:a==null?void 0:a.result,url:a==null?void 0:a.result,width:d?d.value:100,height:d?d.value:100},footer:{text:`Files are purged every 24 hours \u2022 Powered by ${a==null?void 0:a.github}`},color:"0xff0069"};if((s=E==null?void 0:E.value)==null||s){L((r=t==null?void 0:t.channel.id)!=null?r:"0",{embeds:[B]});return}else return{content:a==null?void 0:a.result}}else console.log("[ PetPet Fetch Response ]",a,a==null?void 0:a.status),console.log("[ PetPet Arguments ]",w,h,d,m,E),L((u=t==null?void 0:t.channel.id)!=null?u:"0","Something went wrong, please try again later. Fetch response and PetPet arguments sent to console.")}catch(a){console.log("[ PetPet Error ]",a),console.log("[ PetPet Arguments ]",w,h,d,m,E),L((v=t==null?void 0:t.channel.id)!=null?v:"0","An error occured while fetching and preparing the petpet image. Check debug logs for more info.")}}},K=[Se],_e={...W,onStart(){this.commands=K},onStop(){this.commands=[]},patches:[],getSettingsPanel({settings:e}){return n.createElement(ge,{manifest:W,settings:e,hasToasts:!1,section:null,commands:K})}};Z(_e);
