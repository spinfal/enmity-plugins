function A(e){window.enmity.plugins.registerPlugin(e)}const g=window.enmity.modules.common.Constants;window.enmity.modules.common.Clipboard,window.enmity.modules.common.Assets,window.enmity.modules.common.Messages,window.enmity.modules.common.Clyde,window.enmity.modules.common.Avatars;const S=window.enmity.modules.common.Native,n=window.enmity.modules.common.React;window.enmity.modules.common.Dispatcher;const _=window.enmity.modules.common.Storage,E=window.enmity.modules.common.Toasts,I=window.enmity.modules.common.Dialog;window.enmity.modules.common.Token;const L=window.enmity.modules.common.REST;window.enmity.modules.common.Settings,window.enmity.modules.common.Users;const J=window.enmity.modules.common.Navigation;window.enmity.modules.common.NavigationNative,window.enmity.modules.common.NavigationStack,window.enmity.modules.common.Theme,window.enmity.modules.common.Linking;const M=window.enmity.modules.common.StyleSheet;window.enmity.modules.common.ColorMap,window.enmity.modules.common.Components,window.enmity.modules.common.Locale,window.enmity.modules.common.Profiles,window.enmity.modules.common.Lodash,window.enmity.modules.common.Logger,window.enmity.modules.common.Flux,window.enmity.modules.common.SVG,window.enmity.modules.common.Scenes;const{components:o}=window.enmity;o.Alert,o.Button,o.FlatList;const K=o.Image;o.ImageBackground,o.KeyboardAvoidingView,o.Modal,o.Pressable,o.RefreshControl;const Q=o.ScrollView;o.SectionList,o.StatusBar,o.StyleSheet,o.Switch;const h=o.Text;o.TextInput,o.TouchableHighlight;const b=o.TouchableOpacity;o.TouchableWithoutFeedback,o.Touchable;const p=o.View;o.VirtualizedList,o.Form,o.FormArrow,o.FormCTA,o.FormCTAButton,o.FormCardSection,o.FormCheckbox;const R=o.FormDivider;o.FormHint,o.FormIcon,o.FormInput,o.FormLabel,o.FormRadio;const c=o.FormRow,B=o.FormSection;o.FormSelect,o.FormSubLabel;const Z=o.FormSwitch;o.FormTernaryCheckBox,o.FormText,o.FormTextColors,o.FormTextSizes;const D={byProps:(...e)=>window.enmity.modules.filters.byProps(...e),byName:(e,t)=>window.enmity.modules.filters.byName(e,t),byTypeName:(e,t)=>window.enmity.modules.filters.byTypeName(e,t),byDisplayName:(e,t)=>window.enmity.modules.filters.byDisplayName(e,t)};function T(...e){return window.enmity.modules.bulk(...e)}function k(...e){return window.enmity.modules.getByProps(...e)}window.enmity.modules.common;const V=e=>{let t=0;for(let i in e)t++;return t};function l(e){return window.enmity.assets.getIDByName(e)}const d={Debug:l("debug"),Retry:l("ic_message_retry"),Failed:l("Small"),Cancel:l("ic_megaphone_nsfw_16px"),Add:l("add_white"),Delete:l("ic_message_delete"),Clear:l("ic_clear_all_24px"),Pencil:l("ic_pencil_24px"),Success:l("ic_selection_checked_24px"),Copy:l("toast_copy_link"),Open:l("ic_leave_stage"),Clipboard:l("pending-alert"),Initial:l("coffee"),Debug_Command:{Sent:l("ic_application_command_24px"),Clock:l("clock")},Settings:{Toasts:{Context:l("toast_image_saved"),Settings:l("ic_selection_checked_24px")},Self:l("friends_toast_icon"),Share:l("share"),Robot:l("ic_robot_24px"),Commands:l("ic_profile_badge_bot_commands"),Debug:l("ic_rulebook_16px")}},N=e=>{E.open({content:`Copied ${e} to clipboard.`,source:d.Clipboard})},O=e=>{let t=e.split(`
`).map(i=>{if(i!="")return`"${i.replaceAll(":",'":"').replace(" ","")}",`});return t[0]=`{${t[0]}`,t[V(t)]=`${t[V(t)]}}`,t=t.join(""),t=t.replaceAll("undefined",""),t=t.split("").reverse().join("").replace(",","").split("").reverse().join(""),t};async function ee(){try{let e=await _.getItem("device_list");if(e)return JSON.parse(e);let t=(await L.get("https://gist.githubusercontent.com/adamawolf/3048717/raw/1ee7e1a93dff9416f6ff34dd36b0ffbad9b956e9/Apple_mobile_device_types.txt")).text,i=O(t);await _.setItem("device_list",i);let a=await _.getItem("device_list");return JSON.parse(a)}catch(e){console.warn(`[SpinsPlugins Local Error \u2014 Issue when getting devices: ${e}]`);return}}async function te(e,t,i){let a=await ee();return`**[${e}] Debug Information**
> **Plugin Version:** ${t}
> **Plugin Build:** ${i.split("-")[1]}
> **Discord Build:** ${S.InfoDictionaryManager.Version} (${S.InfoDictionaryManager.Build})
> **Software Version:** ${S.DCDDeviceManager.systemVersion}
> **Device:** ${a[S.DCDDeviceManager.device]}`}const{native:v}=window.enmity;function ne(){v.reload()}v.version,v.build,v.device,v.version;const oe=k("transitionToGuild");async function ie({manifest:e}){const t=`${e.sourceUrl}?${Math.floor(Math.random()*1001)}.js`,i=await(await L.get(t)).text;let a=i.match(/\d\.\d\.\d+/g),s=i.match(/patch\-\d\.\d\.\d+/g);return!a||!s?z(e.name,e.version):(a=a[0],s=s[0],a!=e.version?G(t,a,s.split("-")[1],e,!1):s!=e.build?G(t,a,s.split("-")[1],e,!0):z(e.name,e.version))}const G=(e,t,i,a,s)=>{const m=s?i:t;I.show({title:"Update found",body:`A newer ${s?"build":"version"} is available for ${a.name}. ${s?`
The version will remain at ${t}, but the build will update to ${i}.`:""}
Would you like to install ${s?`build \`${i}\``:`version \`${t}\``}  now?`,confirmText:"Update",cancelText:"Not now",onConfirm:()=>se(e,m,a,s)})},z=(e,t)=>{console.log(`[${e}] Plugin is on the latest version, which is ${t}`),E.open({content:`${e} is on latest version (${t})`,source:d.Success})};async function se(e,t,i,a){window.enmity.plugins.installPlugin(e,({data:s})=>{s=="installed_plugin"||s=="overridden_plugin"?I.show({title:`Updated ${i.name}`,body:`Successfully updated to ${a?"build":"version"} \`${t}\`. 
Would you like to reload Discord now?`,confirmText:"Yep!",cancelText:"Not now",onConfirm:()=>{ne()}}):I.show({title:"Error",body:`Something went wrong while updating ${i.name}.`,confirmText:"Report this issue",cancelText:"Cancel",onConfirm:()=>{oe.openURL(`https://github.com/spinfal/enmity-plugins/issues/new?assignees=&labels=bug&template=bug_report.md&title=%5BBUG%5D%20${i.name}%20Update%20Error%3A%20${a?`b${t}`:`v${t}`}`)}})})}const x=window.enmity.modules.common.Components.General.Animated,[$,ae]=T(D.byProps("transitionToGuild"),D.byProps("setString"));var re=({manifest:e})=>{const t=M.createThemedStyleSheet({container:{paddingTop:30,paddingLeft:20,marginBottom:-5,flexDirection:"row"},text_container:{paddingLeft:15,paddingTop:5,flexDirection:"column",flexWrap:"wrap"},image:{width:75,height:75,borderRadius:10},main_text:{opacity:.975,letterSpacing:.25,fontFamily:g.Fonts.DISPLAY_NORMAL},header:{color:g.ThemeColorMap.HEADER_PRIMARY,fontFamily:g.Fonts.DISPLAY_BOLD,fontSize:25,letterSpacing:.25},sub_header:{color:g.ThemeColorMap.HEADER_SECONDARY,opacity:.975,fontSize:12.75}}),i=n.useRef(new x.Value(1)).current,a=()=>{x.spring(i,{toValue:1.1,duration:250,useNativeDriver:!0}).start()},s=()=>{x.spring(i,{toValue:1,duration:250,useNativeDriver:!0}).start()},m=()=>{$.openURL("https://spin.rip/")},w={transform:[{scale:i}]};return n.createElement(n.Fragment,null,n.createElement(p,{style:t.container},n.createElement(b,{onPress:m,onPressIn:a,onPressOut:s},n.createElement(x.View,{style:[w]},n.createElement(K,{style:[t.image],source:{uri:"https://cdn.spin.rip/r/l9uevwe4ia0.jpg"}}))),n.createElement(p,{style:t.text_container},n.createElement(b,{onPress:()=>{$.openURL(e.sourceUrl)}},n.createElement(h,{style:[t.main_text,t.header]},e.name," ")),n.createElement(p,{style:{flexDirection:"row"}},n.createElement(h,{style:[t.main_text,t.sub_header]},"A plugin by"),n.createElement(b,{onPress:()=>{$.openURL("https://spin.rip/")}},n.createElement(h,{style:[t.main_text,t.sub_header,{paddingLeft:4,fontFamily:g.Fonts.DISPLAY_BOLD}]},e.authors[0].name))),n.createElement(p,{style:{flexDirection:"row"}},n.createElement(h,{style:[t.main_text,t.sub_header]},"Settings page by"),n.createElement(b,{onPress:()=>{$.openURL("https://github.com/acquitelol/")}},n.createElement(h,{style:[t.main_text,t.sub_header,{paddingLeft:4,fontFamily:g.Fonts.DISPLAY_BOLD}]},"Rosie<3"))),n.createElement(p,null,n.createElement(b,{style:{flexDirection:"row"},onPress:()=>{ae.setString(`**${e.name}** v${e.version}`),N("plugin name and version")}},n.createElement(h,{style:[t.main_text,t.sub_header]},"Version:"),n.createElement(h,{style:[t.main_text,t.sub_header,{paddingLeft:4,fontFamily:g.Fonts.DISPLAY_BOLD}]},e.version," "))))))};const[le,Y]=T(D.byProps("transitionToGuild"),D.byProps("setString"));var ce=({manifest:e,settings:t,hasToasts:i,children:a,commands:s})=>{const m=M.createThemedStyleSheet({bottom_padding:{paddingBottom:25},icon:{color:g.ThemeColorMap.INTERACTIVE_NORMAL},item:{color:g.ThemeColorMap.TEXT_MUTED},text_container:{display:"flex",flexDirection:"column"}}),[w,F]=n.useState(),[r,y]=n.useState();return n.createElement(n.Fragment,null,n.createElement(Q,{onTouchStart:u=>{F(u.nativeEvent.pageX),y(u.nativeEvent.pageY)},onTouchEnd:u=>{w-u.nativeEvent.pageX<-100&&r-u.nativeEvent.pageY<40&&r-u.nativeEvent.pageY>-40&&J.pop()}},n.createElement(re,{manifest:e}),a,s&&n.createElement(B,{title:"Plugin Commands"},s.map(u=>n.createElement(c,{label:`/${u.name}`,subLabel:u.description,leading:n.createElement(c.Icon,{style:m.icon,source:d.Settings.Commands}),trailing:c.Arrow,onPress:function(){Y.setString(`/${u.name}`),N(`the command ${u.name}`)}}))),n.createElement(B,{title:"Utility"},i&&n.createElement(n.Fragment,null,n.createElement(c,{label:"Initialization Toasts",leading:n.createElement(c.Icon,{style:m.icon,source:d.Settings.Toasts.Context}),subLabel:`If available, show toasts when ${e.name} is starting`,trailing:n.createElement(Z,{value:t.getBoolean(`${e.name}-toastEnable`,!1),onValueChange:()=>{t.toggle(`${e.name}-toastEnable`,!1),E.open({content:`Successfully ${t.getBoolean(`${e.name}-toastEnable`,!1)?"enabled":"disabled"} initialization toasts.`,source:d.Success})}})}),n.createElement(R,null)),n.createElement(c,{label:"Copy Debug Info",subLabel:`Copy useful debug information of ${e.name} to clipboard.`,leading:n.createElement(c.Icon,{style:m.icon,source:d.Settings.Debug}),trailing:c.Arrow,onPress:async function(){Y.setString(await te(e.name,e.version,e.build)),N("plugin debug information")}}),n.createElement(R,null),n.createElement(c,{label:"Clear Device List Cache",subLabel:"Remove the fetched device list storage. This will not clear Discord's or your iDevice's cache.",leading:n.createElement(c.Icon,{style:m.icon,source:d.Delete}),trailing:c.Arrow,onPress:async function(){await _.removeItem("device_list"),E.open({content:"Cleared device list storage.",source:d.Success})}})),n.createElement(B,{title:"Source"},n.createElement(c,{label:"Check for Updates",subLabel:`Check for any plugin updates for ${e.name}.`,leading:n.createElement(c.Icon,{style:m.icon,source:d.Copy}),trailing:c.Arrow,onPress:()=>{ie({manifest:e})}}),n.createElement(R,null),n.createElement(c,{label:"Source",subLabel:`View ${e.name} source code`,leading:n.createElement(c.Icon,{style:m.icon,source:d.Open}),trailing:c.Arrow,onPress:()=>{le.openURL(`https://github.com/spinfal/enmity-plugins/tree/master/${e.name}`)}})),n.createElement(c,{style:m.bottom_padding,label:`Plugin Version: ${e.version}
Plugin Build: ${e.build.split("-").pop()}`})))},me="PetPet",ue="1.0.6",de="patch-1.0.13",ge="Generate a petpet gif from a given image",we=[{name:"spin",id:"308440976723148800"}],he="#ff0069",fe="https://raw.githubusercontent.com/spinfal/enmity-plugins/master/dist/PetPet.js",q={name:me,version:ue,build:de,description:ge,authors:we,color:he,sourceUrl:fe};function P(e,t,i,a){window.enmity.clyde.sendReply(e,t,i,a)}var j;(function(e){e[e.BuiltIn=0]="BuiltIn",e[e.Guild=1]="Guild",e[e.DM=2]="DM"})(j||(j={}));var U;(function(e){e[e.Chat=1]="Chat",e[e.User=2]="User",e[e.Message=3]="Message"})(U||(U={}));var C;(function(e){e[e.BuiltIn=0]="BuiltIn",e[e.BuiltInText=1]="BuiltInText",e[e.BuiltInIntegration=2]="BuiltInIntegration",e[e.Bot=3]="Bot",e[e.Placeholder=4]="Placeholder"})(C||(C={}));var H;(function(e){e[e.Role=1]="Role",e[e.User=2]="User"})(H||(H={}));var f;(function(e){e[e.SubCommand=1]="SubCommand",e[e.SubCommandGroup=2]="SubCommandGroup",e[e.String=3]="String",e[e.Integer=4]="Integer",e[e.Boolean=5]="Boolean",e[e.User=6]="User",e[e.Channel=7]="Channel",e[e.Role=8]="Role",e[e.Mentionnable=9]="Mentionnable",e[e.Number=10]="Number",e[e.Attachment=11]="Attachment"})(f||(f={}));var W;(function(e){e[e.ApplicationCommand=2]="ApplicationCommand",e[e.MessageComponent=3]="MessageComponent"})(W||(W={}));const ye={id:"petpet-command",name:"petpet",displayName:"petpet",description:"Generate a petpet gif from a given image",displayDescription:"Generate a petpet gif from a given image",type:U.Chat,inputType:C.BuiltInText,options:[{name:"url",displayName:"url",description:"The URL of the image to petpet",displayDescription:"The URL of the image to petpet",type:f.String,required:!1},{name:"user",displayName:"user",description:"Grab a user's avatar to petpet",displayDescription:"Grab a user's avatar to petpet",type:f.User,required:!1},{name:"size",displayName:"size",description:"Change the size of the petpet gif. Max is 512. Defaults to 100, higher values equal larger files and potentially no Discord embeds",displayDescription:"Change the size of the petpet gif. Max is 512. Defaults to 100, higher values equal larger files and potentially no Discord embeds",type:f.Integer,required:!1},{name:"delay",displayName:"delay",description:"The delay between each frame, defaults to 20",displayDescription:"The delay between each frame, defaults to 20",type:f.Integer,required:!1},{name:"whisper",displayName:"whisper",description:"Only you can see the result",displayDescription:"Only you can see the result",type:f.Boolean,required:!1}],execute:async function(e,t){const i=e[e.findIndex(r=>r.name==="url")],a=e[e.findIndex(r=>r.name==="user")],s=e[e.findIndex(r=>r.name==="size")],m=e[e.findIndex(r=>r.name==="delay")],w=e[e.findIndex(r=>r.name==="whisper")],F="v2";if(!i&&!a)return P(t?.channel.id??"0","No argument provided, nothing will happen. Here's a banana instead \u{1F34C}");try{const r=await L.get(`https://petpet-api.clit.repl.co/petpet?url=${i?.value?i.value:k("getUser").getUser(a?.value).getAvatarURL().split("?")[0].replace(/gif|webp/,"png")}&size=${s?s.value:100}&delay=${m?m.value:20}&version=${F}`).then(y=>y.body);if(r.status==!0){const y={type:"rich",image:{proxy_url:r?.result,url:r?.result,width:s?s.value:100,height:s?s.value:100},footer:{text:`Files are purged every 24 hours \u2022 Powered by ${r?.github}`},color:"0xff0069"};if(w?.value??!0){P(t?.channel.id??"0",{embeds:[y]});return}else return{content:r?.result}}else console.log("[ PetPet Fetch Response ]",r,r?.status),console.log("[ PetPet Arguments ]",i,a,s,m,w),P(t?.channel.id??"0","Something went wrong, please try again later. Fetch response and PetPet arguments sent to console.")}catch(r){console.log("[ PetPet Error ]",r),console.log("[ PetPet Arguments ]",i,a,s,m,w),P(t?.channel.id??"0","An error occured while fetching and preparing the petpet image. Check debug logs for more info.")}}},X=[ye],be={...q,onStart(){this.commands=X},onStop(){this.commands=[]},patches:[],getSettingsPanel({settings:e}){return n.createElement(ce,{manifest:q,settings:e,hasToasts:!1,commands:X})}};A(be);
