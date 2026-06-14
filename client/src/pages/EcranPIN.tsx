import{useState,useEffect}from'react';import{useLocation}from'wouter';import{trpc}from'@/lib/trpc';import{useEmployeSession,EmployeSession}from'@/contexts/EmployeSessionContext';import{useApp}from'@/lib/app-context';import{toast}from'sonner';

// Design: "Prestige Noir" — Fond noir texturé, bordure dorée, boutons blancs
// Palette: #000 fond, #C9A84C or, #fff boutons, #1a1a1a carte
// Inspiré du design fourni: INTEMPORELLE / RGPD & CYBERSÉCURITÉ / MON STUDIO

const GOLD = '#C9A84C';
const GOLD_DIM = 'rgba(201,168,76,0.15)';
const GOLD_BORDER = 'rgba(201,168,76,0.6)';

export default function EcranPIN(){
  const[,nav]=useLocation();
  const{setEmploye}=useEmployeSession();
  const{state}=useApp();
  const[step,setStep]=useState<'sel'|'pin'>('sel');
  const[selId,setSelId]=useState(0);
  const[selNom,setSelNom]=useState('');
  const[pin,setPin]=useState('');
  const{data:emps}=trpc.studioUsers.listForPin.useQuery();
  const salonName=state.salonInfo?.nom||'votre salon';
  const salonCity=state.salonInfo?.ville||'';
  const selectedEmploye=emps?.find((e:any)=>e.id===selId);
  const selectedIdentity=selectedEmploye?[selectedEmploye.prenom,selectedEmploye.nom].filter(Boolean).join(' '):selNom;
  const login=trpc.studioUsers.loginWithPin.useMutation({
    onSuccess:(d)=>{setEmploye({...d.employe,loginAt:new Date().toISOString()} as EmployeSession);nav('/clients');},
    onError:(e)=>toast.error(e.message||'PIN incorrect'),
  });
  useEffect(()=>{if(pin.length===4&&selId)login.mutate({employeId:selId,pin});},[pin]);

  const ks=['1','2','3','4','5','6','7','8','9','','0','X'];

  // Styles
  const pageStyle:React.CSSProperties={
    minHeight:'100vh',
    background:'#000000',
    display:'flex',
    flexDirection:'column',
    alignItems:'center',
    justifyContent:'center',
    padding:'24px 16px',
    fontFamily:"'Outfit', 'Inter', sans-serif",
  };

  const cardStyle:React.CSSProperties={
    width:'100%',
    maxWidth:420,
    background:'#000000',
    border:`2px solid ${GOLD_BORDER}`,
    borderRadius:20,
    padding:'32px 28px 28px',
    boxShadow:`0 0 40px rgba(212, 175, 55, 0.1), 0 20px 60px rgba(0,0,0,1)`,
    display:'flex',
    flexDirection:'column',
    alignItems:'center',
  };

  const logoStyle:React.CSSProperties={
    textAlign:'center',
    marginBottom:20,
    paddingBottom:20,
    borderBottom:`1px solid rgba(201,168,76,0.25)`,
    width:'100%',
  };

  const pinBtnStyle=(k:string):React.CSSProperties=>({
    height:68,
    borderRadius:14,
    border:`1px solid ${k ? 'rgba(212, 175, 55, 0.3)' : 'transparent'}`,
    background:k?'#000000':'transparent',
    color:k?'#ffffff':'transparent',
    fontSize:22,
    fontWeight:700,
    cursor:k?'pointer':'default',
    visibility:k?'visible':'hidden',
    transition:'all 0.12s ease',
    boxShadow:k?'0 0 10px rgba(212, 175, 55, 0.1)':'none',
    fontFamily:"'Outfit', sans-serif",
  });

  const linkBtnStyle:React.CSSProperties={
    background:'none',
    border:'none',
    color:'#ffffff',
    fontSize:15,
    fontWeight:600,
    cursor:'pointer',
    padding:'8px 0',
    fontFamily:"'Outfit', sans-serif",
    letterSpacing:'0.01em',
  };

  const empBtnStyle:React.CSSProperties={
    padding:'14px 24px',
    borderRadius:12,
    border:`1px solid ${GOLD_BORDER}`,
    background:GOLD_DIM,
    color:GOLD,
    cursor:'pointer',
    fontFamily:"'Outfit', sans-serif",
    fontWeight:700,
    fontSize:15,
    transition:'all 0.15s ease',
    minWidth:100,
  };

  return(
    <div style={pageStyle}>
      <div style={cardStyle}>
        {/* Logo */}
        <div style={logoStyle}>
          <div style={{fontSize:22,fontWeight:900,color:'#ffffff',letterSpacing:'0.15em',fontFamily:"'Outfit', sans-serif"}}>STUDIO MANAGER</div>
          <div style={{fontSize:11,fontWeight:600,color:GOLD,letterSpacing:'0.2em',marginTop:4}}>EUROPE</div>
        </div>

        {/* Subtitle */}
        <div style={{textAlign:'center',marginBottom:24}}>
          <div style={{fontSize:16,fontWeight:700,color:'#ffffff',letterSpacing:'0.02em'}}>studio.studiomanagereurope.eu</div>
          <div style={{fontSize:13,fontWeight:800,color:GOLD,letterSpacing:'0.08em',marginTop:8,textTransform:'uppercase'}}>{salonName}</div>
          {salonCity&&<div style={{fontSize:11,fontWeight:600,color:'rgba(255,255,255,0.55)',marginTop:3}}>Salon de {salonCity}</div>}
          <div style={{fontSize:11,fontWeight:600,color:GOLD,letterSpacing:'0.18em',marginTop:8}}>{step==='pin'&&selectedIdentity?`PIN DE ${selectedIdentity.toUpperCase()}`:'TABLETTE DU SALON'}</div>
        </div>

        {/* PIN pad inner card */}
        <div style={{width:'100%',background:'rgba(0,0,0,0.4)',borderRadius:14,padding:'20px 16px',marginBottom:20,border:'1px solid rgba(255,255,255,0.06)'}}>
          {step==='sel'&&(
            <>
              <p style={{color:'#ffffff',fontWeight:700,fontSize:15,textAlign:'center',marginBottom:8,marginTop:0}}>Qui utilise la tablette ?</p>
              <p style={{color:'rgba(255,255,255,0.62)',fontSize:12,textAlign:'center',marginBottom:16,marginTop:0}}>Sélectionnez le profil rattaché à {salonName}, puis saisissez son code PIN.</p>
              {/* Dots placeholder */}
              <div style={{display:'flex',gap:10,justifyContent:'center',marginBottom:20}}>
                {[0,1,2,3].map(i=><div key={i} style={{width:14,height:14,borderRadius:'50%',border:`1.5px solid ${GOLD}`,background:'transparent'}}/>)}
              </div>
              {/* Employee selection */}
              <p style={{color:'rgba(255,255,255,0.5)',fontSize:12,textAlign:'center',marginBottom:12,marginTop:0}}>Sélectionnez votre profil</p>
              <div style={{display:'flex',flexWrap:'wrap',gap:8,justifyContent:'center'}}>
                {emps?.map((e:any)=>(
                  <button key={e.id} onClick={()=>{if(!e.hasPinSet)return;setSelId(e.id);setSelNom(e.prenom);setPin('');setStep('pin');}} style={{...empBtnStyle,opacity:e.hasPinSet?1:0.4}}>{[e.prenom,e.nom].filter(Boolean).join(' ')}</button>
                ))}
              </div>
            </>
          )}

          {step==='pin'&&(
            <>
              <p style={{color:'#ffffff',fontWeight:700,fontSize:15,textAlign:'center',marginBottom:8,marginTop:0}}>Code PIN de {selectedIdentity||selNom}</p>
              <p style={{color:'rgba(255,255,255,0.62)',fontSize:12,textAlign:'center',marginBottom:16,marginTop:0}}>Vous êtes sur la tablette de {salonName}. Vérifiez le nom avant de saisir le PIN.</p>
              {/* Dots */}
              <div style={{display:'flex',gap:10,justifyContent:'center',marginBottom:20}}>
                {[0,1,2,3].map(i=><div key={i} style={{width:14,height:14,borderRadius:'50%',border:`1.5px solid ${GOLD}`,background:i<pin.length?GOLD:'transparent',transition:'background 0.15s'}}/>)}
              </div>
              {/* Keypad */}
              <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10,maxWidth:280,margin:'0 auto'}}>
                {ks.map((k,i)=>(
                  <button
                    key={i}
                    onClick={()=>{if(!k)return;if(k==='X')setPin(p=>p.slice(0,-1));else if(pin.length<4)setPin(p=>p+k);}}
                    style={pinBtnStyle(k)}
                    onMouseEnter={e=>{if(k)(e.currentTarget.style.background='rgba(212, 175, 55, 0.1)');}}
                    onMouseLeave={e=>{if(k)(e.currentTarget.style.background='#000000');}}
                  >
                    {k==='X'?'⌫':k}
                  </button>
                ))}
              </div>
              <button onClick={()=>{setStep('sel');setPin('');setSelId(0);setSelNom('');}} style={{...linkBtnStyle,display:'block',margin:'16px auto 0',color:'rgba(255,255,255,0.4)',fontSize:13}}>← Retour</button>
            </>
          )}
        </div>

        {/* Bottom links */}
        <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:4,width:'100%'}}>
          <button onClick={()=>nav('/login-email')} style={linkBtnStyle}>Se connecter avec email →</button>
          <button onClick={()=>nav('/premiere-connexion')} style={linkBtnStyle}>Première connexion →</button>
        </div>
      </div>
    </div>
  );
}
