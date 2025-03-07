import './App.scss';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap-icons/font/bootstrap-icons.css';
import {useState, useEffect} from 'react';

export default function ContadorApp(){

  const [arrNomesContadores, atNomesContadores] = useState(['Contador 1', 'Contador 2']);
  const [arrContadores, atContadores]           = useState([0, 0]);
  const [arrEstiloBtCopiar, atEstiloBtCopiar]   = useState(['info', 'bi bi-copy']);
  const [lembrancaStatus, atLembrancaStatus]    = useState(false);
  const [doisContsMarcado, atDoisContsMarcado]  = useState(true);
  const [numerosNegativos, atNumerosNegativos]  = useState(false);

  const chaveArmazenamento = 'Dados_contadores';

  useEffect(() => {
    let carregar = false;
    try{
      const chave = '__teste_ls';
      localStorage.setItem(chave, null);
      localStorage.removeItem(chave);
      carregar = true;
    }catch(e){
      atLembrancaStatus(false);
    }
    if(carregar){
      const dados = localStorage.getItem(chaveArmazenamento);
      if(dados !== null){
        const objDados = JSON.parse(dados);
        atNomesContadores([objDados['nomes_contadores'][0], objDados['nomes_contadores'][1]]);
        atContadores([objDados['contadores'][0], objDados['contadores'][1]]);
        atLembrancaStatus(true);
        atDoisContsMarcado(objDados['dois_contadores']);
        atNumerosNegativos(objDados['numeros_negativos']);
      }
    }
  }, []);

  const controlarNome = (event, indice) => {
    atNomesContadores(dadosAnt => {
      const nvArr = [...dadosAnt];
      nvArr[indice] = event.target.value;
      return nvArr;
    });
  }

  const controlarContador = (event, indice) => {
    const nvContagem = parseInt(event.target.value);
    atContadores(dadosAnt => {
      const nvArr = [...dadosAnt];
      nvArr[indice] = nvContagem;
      return nvArr;
    });
  }

  const verificarNumero = (event) => {
    if(parseInt(event.target.value) < 0 && !numerosNegativos){
      converterNumNegativo();
    }
  }

  const calcular = (event, indice, operacao) => {
    event.preventDefault();
    atContadores(dadosAnt => {
      const nvArr = [...dadosAnt];
      if(operacao === '+'){
        nvArr[indice] += 1;
      }else{
        if(nvArr[indice] === 0 && !numerosNegativos){
          nvArr[indice] = nvArr[indice];
        }else{
          nvArr[indice] -= 1;
        }
      }
      return nvArr;
    });
  }

  const copiar = () => {
    let conteudo = arrNomesContadores[0] + ': ' + arrContadores[0];
    if(doisContsMarcado){
      conteudo += ' | ' + arrNomesContadores[1] + ': ' + arrContadores[1];
    }
    navigator.clipboard.writeText(conteudo);
    atualizarEstiloBtCopiar('success', 'bi bi-check2');
    setTimeout(() => {
      atualizarEstiloBtCopiar('info', 'bi bi-copy');
    }, 2000);
  }

  const atualizarEstiloBtCopiar = (classeBt, icone) => {
    atEstiloBtCopiar(dadosAnt => {
      const nvArr = [...dadosAnt];
      nvArr[0] = classeBt;
      nvArr[1] = icone;
      return nvArr;
    });
  }

  const resetar = () => {
    atContadores([0, 0]);
  }

  const controlarLembranca = (event) => {
    atLembrancaStatus(event.target.checked);
  }

  const controlarQtdContadores = (event) => {
    const marcado = event.target.checked;
    atDoisContsMarcado(marcado);
  }

  useEffect(() => {
    if(!numerosNegativos){
      converterNumNegativo();
    }
  }, [numerosNegativos]);

  const converterNumNegativo = () => {
    atContadores(dadosAnt => dadosAnt.map(num => Math.abs(num)));
  }

  useEffect(() => {
    if(lembrancaStatus){
      localStorage.setItem(chaveArmazenamento, JSON.stringify({
        'nomes_contadores' : arrNomesContadores,
        'contadores'       : arrContadores,
        'dois_contadores'  : doisContsMarcado,
        'numeros_negativos': numerosNegativos
      }));
    }else{
      localStorage.removeItem(chaveArmazenamento);
    }
  }, [arrNomesContadores, arrContadores, lembrancaStatus, doisContsMarcado, numerosNegativos]);

  return (
    <>
      <div className='row container-fluid text-center' id='div_contadores' style={{width: doisContsMarcado ? '70%' : '45%'}}>
        {
          arrNomesContadores.map((nome, indice) => (
            (indice === 1 && !doisContsMarcado) ? null : (
              <div key={indice} className={doisContsMarcado ? 'col-12 col-md-6 div_contador' : 'col div_contador'}>
                <form>
                  <h2><input type='text' maxLength='150' className='form-control' id={`nome_contador_${indice}`} value={nome} onChange={(event) => controlarNome(event, indice)}></input></h2>
                  <input type='number' className='form-control' id={`contagem_${indice}`} value={arrContadores[indice]} onChange={(event) => controlarContador(event, indice)} onBlur={verificarNumero}></input>
                  <div className='row' id='div_bts'>
                   <div className='col'>
                     <button className='btn btn-danger' onClick={(event) => calcular(event, indice, '-')}>
                        <i className='bi bi-dash'></i>
                      </button>
                    </div>
                    <div className='col'>
                      <button className='btn btn-success' onClick={(event) => calcular(event, indice, '+')}>
                        <i className='bi bi-plus'></i>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )
          ))
        }
      </div>

      <div className='row' id='div_config'>
        <div className='col-12 col-md-4 d-flex justify-content-center align-items-center'>
          <button className={`btn btn-${arrEstiloBtCopiar[0]}`} onClick={copiar}>
            <i className={arrEstiloBtCopiar[1]}></i>
          </button>&nbsp;&nbsp;
          <button className='btn btn-warning' onClick={resetar}>
            <i className='bi bi-arrow-clockwise'></i>
          </button>
        </div>
        <div className='col-12 col-md' id='div_config_marcadores'>
          <ul>
            <li>
              <div className='form-check'>
                <input type='checkbox' className='form-check-input' id='lembrar' onChange={controlarLembranca} checked={lembrancaStatus}></input>&nbsp;
                <label htmlFor='lembrar' className='form-check-label'>Lembrar</label>
              </div>
            </li>
            <li>
              <div className='form-check'>
                <input type='checkbox' className='form-check-input' id='dois_contadores' onChange={controlarQtdContadores} checked={doisContsMarcado}></input>&nbsp;
                <label htmlFor='dois_contadores' className='form-check-label'>Dois contadores</label>
              </div>
            </li>
            <li>
              <div className='form-check'>
                <input type='checkbox' className='form-check-input' id='numeros_negativos' onChange={(event) => atNumerosNegativos(event.target.checked)} checked={numerosNegativos}></input>&nbsp;
                <label htmlFor='numeros_negativos' className='form-check-label'>Números negativos</label>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <article className='container text-center'>
        <header>
          <h1>Contador</h1>
        </header>
        <footer>
          <p>Desenvolvido por <a href='https://github.com/Gabrielffer' target='_blank' className='text-info'>Gabrielffer</a></p>
          <p>Ícone de favorito criado com <a href='https://favicon.io/' target='_blank'>Favicon</a></p>
          <p>Última atualização: <span className='text-warning'>28/02/2025</span></p>
        </footer>
      </article>
    </>
  );
}