function G(e){window.enmity.plugins.registerPlugin(e)}const E={byProps:(...e)=>window.enmity.modules.filters.byProps(...e),byName:(e,t)=>window.enmity.modules.filters.byName(e,t),byTypeName:(e,t)=>window.enmity.modules.filters.byTypeName(e,t),byDisplayName:(e,t)=>window.enmity.modules.filters.byDisplayName(e,t)};function k(...e){return window.enmity.modules.bulk(...e)}function F(...e){return window.enmity.modules.getByProps(...e)}window.enmity.modules.common;function Y(e){return window.enmity.patcher.create(e)}const y=window.enmity.modules.common.Constants;window.enmity.modules.common.Clipboard,window.enmity.modules.common.Assets,window.enmity.modules.common.Messages,window.enmity.modules.common.Clyde,window.enmity.modules.common.Avatars;const $=window.enmity.modules.common.Native,n=window.enmity.modules.common.React;window.enmity.modules.common.Dispatcher;const T=window.enmity.modules.common.Storage,b=window.enmity.modules.common.Toasts,A=window.enmity.modules.common.Dialog;window.enmity.modules.common.Token;const M=window.enmity.modules.common.REST;window.enmity.modules.common.Settings,window.enmity.modules.common.Users;const j=window.enmity.modules.common.Navigation;window.enmity.modules.common.NavigationNative,window.enmity.modules.common.NavigationStack,window.enmity.modules.common.Theme,window.enmity.modules.common.Linking;const N=window.enmity.modules.common.StyleSheet;window.enmity.modules.common.ColorMap,window.enmity.modules.common.Components,window.enmity.modules.common.Locale,window.enmity.modules.common.Profiles,window.enmity.modules.common.Lodash,window.enmity.modules.common.Logger,window.enmity.modules.common.Flux,window.enmity.modules.common.SVG,window.enmity.modules.common.Scenes;var z="HideBlockedMessages",W="1.3.6",X="patch-1.0.9",q="For when you really need to shut someone the f*** up.",J=[{name:"Marek (modified by spin)",id:"308440976723148800"}],K="#ff0069",Q="https://raw.githubusercontent.com/spinfal/enmity-plugins/master/dist/HideBlockedMessages.js",d={name:z,version:W,build:X,description:q,authors:J,color:K,sourceUrl:Q};function Z(e,t,i){return window.enmity.settings.getBoolean(e,t,i)}const U=e=>{let t=0;for(let i in e)t++;return t},ee=e=>{let t=e.split(`
`).map(i=>{if(i!="")return`"${i.replaceAll(":",'":"').replace(" ","")}",`});return t[0]=`{${t[0]}`,t[U(t)]=`${t[U(t)]}}`,t=t.join(""),t=t.replaceAll("undefined",""),t=t.split("").reverse().join("").replace(",","").split("").reverse().join(""),t};async function te(){try{let e=await T.getItem("device_list");if(e)return JSON.parse(e);let t=(await M.get("https://gist.githubusercontent.com/adamawolf/3048717/raw/1ee7e1a93dff9416f6ff34dd36b0ffbad9b956e9/Apple_mobile_device_types.txt")).text,i=ee(t);await T.setItem("device_list",i);let a=await T.getItem("device_list");return JSON.parse(a)}catch(e){console.warn(`[SpinsPlugins Local Error \u2014 Issue when getting devices: ${e}]`);return}}async function ne(e,t,i){let a=await te();return`**[${e}] Debug Information**
> **Plugin Version:** ${t}
> **Plugin Build:** ${i.split("-")[1]}
> **Discord Build:** ${$.InfoDictionaryManager.Version} (${$.InfoDictionaryManager.Build})
> **Software Version:** ${$.DCDDeviceManager.systemVersion}
> **Device:** ${a[$.DCDDeviceManager.device]}`}function r(e){return window.enmity.assets.getIDByName(e)}const c={Debug:r("debug"),Retry:r("ic_message_retry"),Failed:r("Small"),Cancel:r("ic_megaphone_nsfw_16px"),Add:r("add_white"),Delete:r("ic_message_delete"),Clear:r("ic_clear_all_24px"),Pencil:r("ic_pencil_24px"),Copy:r("toast_copy_link"),Open:r("ic_leave_stage"),Clipboard:r("pending-alert"),Debug_Command:{Sent:r("ic_application_command_24px"),Clock:r("clock")},Settings:{Toasts:{Context:r("toast_image_saved"),Settings:r("ic_selection_checked_24px")},Share:r("share"),Commands:r("ic_profile_badge_bot_commands"),Debug:r("ic_rulebook_16px")}},P=e=>{b.open({content:`Copied ${e} to clipboard.`,source:c.Clipboard})},{native:v}=window.enmity;function oe(){v.reload()}v.version,v.build,v.device,v.version;const ie=F("transitionToGuild");async function ae({manifest:e}){const t=`${e.sourceUrl}?${Math.floor(Math.random()*1001)}.js`,i=await(await M.get(t)).text;let a=i.match(/\d\.\d\.\d+/g),s=i.match(/patch\-\d\.\d\.\d+/g);return!a||!s?H(e.name,e.version):(a=a[0],s=s[0],a!=e.version?V(t,a,s.split("-")[1],e,!1):s!=e.build?V(t,a,s.split("-")[1],e,!0):H(e.name,e.version))}const V=(e,t,i,a,s)=>{const u=s?i:t;A.show({title:"Update found",body:`A newer ${s?"build":"version"} is available for ${a.name}. ${s?`
The version will remain at ${t}, but the build will update to ${i}.`:""}
Would you like to install ${s?`build \`${i}\``:`version \`${t}\``}  now?`,confirmText:"Update",cancelText:"Not now",onConfirm:()=>se(e,u,a,s)})},H=(e,t)=>{console.log(`[${e}] Plugin is on the latest version, which is ${t}`),b.open({content:`${e} is on latest version (${t})`,source:c.Settings.Toasts.Settings})};async function se(e,t,i,a){window.enmity.plugins.installPlugin(e,({data:s})=>{s=="installed_plugin"||s=="overridden_plugin"?A.show({title:`Updated ${i.name}`,body:`Successfully updated to ${a?"build":"version"} \`${t}\`. 
Would you like to reload Discord now?`,confirmText:"Yep!",cancelText:"Not now",onConfirm:()=>{oe()}}):A.show({title:"Error",body:`Something went wrong while updating ${i.name}.`,confirmText:"Report this issue",cancelText:"Cancel",onConfirm:()=>{ie.openURL(`https://github.com/spinfal/enmity-plugins/issues/new?assignees=&labels=bug&template=bug_report.md&title=%5BBUG%5D%20${i.name}%20Update%20Error%3A%20${a?`b${t}`:`v${t}`}`)}})})}const{components:o}=window.enmity;o.Alert,o.Button,o.FlatList;const le=o.Image;o.ImageBackground,o.KeyboardAvoidingView,o.Modal,o.Pressable,o.RefreshControl;const re=o.ScrollView;o.SectionList,o.StatusBar,o.StyleSheet,o.Switch;const f=o.Text;o.TextInput,o.TouchableHighlight;const S=o.TouchableOpacity;o.TouchableWithoutFeedback,o.Touchable;const _=o.View;o.VirtualizedList,o.Form,o.FormArrow,o.FormCTA,o.FormCTAButton,o.FormCardSection,o.FormCheckbox;const L=o.FormDivider;o.FormHint,o.FormIcon,o.FormInput,o.FormLabel,o.FormRadio;const m=o.FormRow,I=o.FormSection;o.FormSelect,o.FormSubLabel;const me=o.FormSwitch;o.FormTernaryCheckBox,o.FormText,o.FormTextColors,o.FormTextSizes;const D=window.enmity.modules.common.Components.General.Animated,[C,ce]=k(E.byProps("transitionToGuild"),E.byProps("setString"));var de=({manifest:e})=>{const t=N.createThemedStyleSheet({container:{paddingTop:30,paddingLeft:20,marginBottom:-5,flexDirection:"row"},text_container:{paddingLeft:15,paddingTop:5,flexDirection:"column",flexWrap:"wrap"},image:{width:75,height:75,borderRadius:10},main_text:{opacity:.975,letterSpacing:.25},header:{color:y.ThemeColorMap.HEADER_PRIMARY,fontFamily:y.Fonts.DISPLAY_BOLD,fontSize:25,letterSpacing:.25},sub_header:{color:y.ThemeColorMap.HEADER_SECONDARY,opacity:.975,fontSize:12.75}}),i=n.useRef(new D.Value(1)).current,a=()=>{D.spring(i,{toValue:1.1,duration:250,useNativeDriver:!0}).start()},s=()=>{D.spring(i,{toValue:1,duration:250,useNativeDriver:!0}).start()},u=()=>{C.openURL("https://spin.rip/")},h={transform:[{scale:i}]};return n.createElement(n.Fragment,null,n.createElement(_,{style:t.container},n.createElement(S,{onPress:u,onPressIn:a,onPressOut:s},n.createElement(D.View,{style:[h]},n.createElement(le,{style:[t.image],source:{uri:"https://cdn.spin.rip/r/l9uevwe4ia0.jpg"}}))),n.createElement(_,{style:t.text_container},n.createElement(S,{onPress:()=>{C.openURL(e.sourceUrl)}},n.createElement(f,{style:[t.main_text,t.header]},e.name," ")),n.createElement(_,{style:{flexDirection:"row"}},n.createElement(f,{style:[t.main_text,t.sub_header]},"A plugin by"),n.createElement(S,{onPress:()=>{C.openURL("https://spin.rip/")}},n.createElement(f,{style:[t.main_text,t.sub_header,{paddingLeft:4,fontFamily:y.Fonts.DISPLAY_BOLD}]},e.authors[0].name))),n.createElement(_,{style:{flexDirection:"row"}},n.createElement(f,{style:[t.main_text,t.sub_header]},"Settings page by"),n.createElement(S,{onPress:()=>{C.openURL("https://github.com/acquitelol/")}},n.createElement(f,{style:[t.main_text,t.sub_header,{paddingLeft:4,fontFamily:y.Fonts.DISPLAY_BOLD}]},"Acquite <3"))),n.createElement(_,null,n.createElement(S,{style:{flexDirection:"row"},onPress:()=>{ce.setString(`**${e.name}** v${e.version}`),P("plugin name and version")}},n.createElement(f,{style:[t.main_text,t.sub_header]},"Version:"),n.createElement(f,{style:[t.main_text,t.sub_header,{paddingLeft:4,fontFamily:y.Fonts.DISPLAY_BOLD}]},e.version," "))))))};const[ue,O]=k(E.byProps("transitionToGuild"),E.byProps("setString"));var ge=({manifest:e,settings:t,hasToasts:i,section:a,commands:s})=>{const u=N.createThemedStyleSheet({icon:{color:y.ThemeColorMap.INTERACTIVE_NORMAL},item:{color:y.ThemeColorMap.TEXT_MUTED},text_container:{display:"flex",flexDirection:"column"}}),[h,p]=n.useState(),[g,w]=n.useState();return n.createElement(n.Fragment,null,n.createElement(re,{onTouchStart:l=>{p(l.nativeEvent.pageX),w(l.nativeEvent.pageY)},onTouchEnd:l=>{h-l.nativeEvent.pageX<-100&&g-l.nativeEvent.pageY<40&&g-l.nativeEvent.pageY>-40&&j.pop()}},n.createElement(de,{manifest:e}),a,s&&n.createElement(I,{title:"Plugin Commands"},s.map(l=>n.createElement(m,{label:`/${l.name}`,subLabel:l.description,leading:n.createElement(m.Icon,{style:u.icon,source:c.Settings.Commands}),trailing:m.Arrow,onPress:function(){O.setString(`/${l.name}`),P(`the command ${l.name}`)}}))),n.createElement(I,{title:"Utility"},i&&n.createElement(n.Fragment,null,n.createElement(m,{label:"Initialization Toasts",leading:n.createElement(m.Icon,{style:u.icon,source:c.Settings.Toasts.Context}),subLabel:`If available, show toasts when ${e.name} is starting`,trailing:n.createElement(me,{value:t.getBoolean(`${e.name}-toastEnable`,!1),onValueChange:()=>{t.toggle(`${e.name}-toastEnable`,!1),b.open({content:`Successfully ${t.getBoolean(`${e.name}-toastEnable`,!1)?"enabled":"disabled"} initialization toasts.`,source:c.Settings.Toasts.Settings})}})}),n.createElement(L,null)),n.createElement(m,{label:"Copy Debug Info",subLabel:`Copy useful debug information of ${e.name} to clipboard.`,leading:n.createElement(m.Icon,{style:u.icon,source:c.Settings.Debug}),trailing:m.Arrow,onPress:async function(){O.setString(await ne(e.name,e.version,e.build)),P("plugin debug information")}}),n.createElement(L,null),n.createElement(m,{label:"Clear Device List Cache",subLabel:"Remove the fetched device list storage. This will not clear Discord's or your iDevice's cache.",leading:n.createElement(m.Icon,{style:u.icon,source:c.Delete}),trailing:m.Arrow,onPress:async function(){await T.removeItem("device_list"),b.open({content:"Cleared device list storage.",source:c.Settings.Toasts.Settings})}})),n.createElement(I,{title:"Source"},n.createElement(m,{label:"Check for Updates",subLabel:`Check for any plugin updates for ${e.name}.`,leading:n.createElement(m.Icon,{style:u.icon,source:c.Copy}),trailing:m.Arrow,onPress:()=>{ae({manifest:e})}}),n.createElement(L,null),n.createElement(m,{label:"Source",subLabel:`View ${e.name} source code`,leading:n.createElement(m.Icon,{style:u.icon,source:c.Open}),trailing:m.Arrow,onPress:()=>{ue.openURL(`https://github.com/spinfal/enmity-plugins/tree/master/${e.name}`)}})),n.createElement(m,{label:`Plugin Version: ${e.version}
Plugin Build: ${e.build.split("-").pop()}`})))};const x=Y("HideBlockedMessages"),B=F("_currentDispatchActionType","_subscriptions","_waitQueue"),R=F("isBlocked","isFriend"),pe={...d,onStart(){let e=0,t=3;const i=()=>{let a=Z(d.name,`${d.name}-toastEnable`,!1);try{e++,console.log(`${d.name} delayed start attempt ${e}/${t}.`),a&&b.open({content:`${d.name} start attempt ${e}/${t}.`,source:c.Debug});const s=B._actionHandlers._orderedActionHandlers.LOAD_MESSAGES_SUCCESS.find(p=>p.name==="MessageStore"),u=B._actionHandlers._orderedActionHandlers.MESSAGE_CREATE.find(p=>p.name==="MessageStore"),h=B._actionHandlers._orderedActionHandlers.MESSAGE_UPDATE.find(p=>p.name==="MessageStore");x.before(u,"actionHandler",(p,g)=>{var w;const l=g[0].message;g[0].message=R.isBlocked((w=l==null?void 0:l.author)==null?void 0:w.id)?null:l}),x.before(h,"actionHandler",(p,g)=>{var w;const l=g[0].message;g[0].message=R.isBlocked((w=l==null?void 0:l.author)==null?void 0:w.id)?null:l}),x.before(s,"actionHandler",(p,g)=>{g[0].messages=g[0].messages.filter(w=>!R.isBlocked(w.author.id))}),console.log(`${d.name} delayed start successful.`),a&&b.open({content:`${d.name} start successful.`,source:c.Settings.Toasts.Settings})}catch(s){console.log(`[${d.name} Error]`,s),e<t?(console.warn(`${d.name} failed to start. Trying again in ${e}0s.`),a&&b.open({content:`${d.name} failed to start trying again in ${e}0s.`,source:c.Failed}),setTimeout(i,e*1e4)):(console.error(`${d.name} failed to start. Giving up.`),b.open({content:`${d.name} failed to start. Giving up.`,source:c.Failed}))}};setTimeout(i,300)},onStop(){x.unpatchAll()},patches:[],getSettingsPanel({settings:e}){return n.createElement(ge,{manifest:d,settings:e,hasToasts:!0,section:null,commands:null})}};G(pe);
