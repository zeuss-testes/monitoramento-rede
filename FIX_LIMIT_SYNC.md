# Correção do Problema de Sincronização de Limites de Dados

## Problema Identificado

O aplicativo Android estava usando duas fontes de dados diferentes:
1. **Backend Node.js** (porta 4000) - funcionando corretamente
2. **Conexão direta Turso** hardcoded no app - inconsistente e desatualizada

Isso causava inconsistência nos limites de dados exibidos no app.

## Solução Implementada

### 1. Novo BackendClient
- Criado `BackendClient.kt` para comunicação com o backend local
- Detecção automática de IP (testa múltiplos IPs comuns)
- Fallback para o Turso caso o backend falhe
- Cache do IP funcionando para melhor performance

### 2. ViewModel Atualizado
- Modificado `UsageMonitorViewModel.kt` para usar `BackendClient` primariamente
- Mantém `TursoClient` como fallback
- Logs detalhados para diagnóstico

### 3. Activity de Teste
- Criado `BackendTestActivity.kt` para diagnóstico
- Interface para testar conexão e limites
- Logs em tempo real para debugging

## Como Testar

### 1. Iniciar o Backend
```bash
cd backend
npm start
```
Verifique se está rodando na porta 4000.

### 2. Compilar o App
```bash
cd android-app
./gradlew assembleDebug
```

### 3. Instalar e Testar
1. Instale o APK no dispositivo/emulador
2. Abra o app e configure um funcionário com IMEI
3. Use a `BackendTestActivity` para testar a conexão:
   ```kotlin
   // Para abrir a activity de teste (temporarily)
   val intent = Intent(this, BackendTestActivity::class.java)
   startActivity(intent)
   ```

### 4. Verificar Logs
Use `adb logcat` para monitorar:
```bash
adb logcat | grep -E "(ViewModel|BackendClient|TursoClient)"
```

## IPs Testados Automaticamente

O app testa estes IPs em ordem:
- `10.0.2.2` (emulador Android)
- `192.168.1.10` (exemplo de rede local)
- `192.168.0.1` (outro exemplo comum)
- `localhost` (testes locais)

## Diagnóstico de Problemas

### Se o app não conectar:
1. Verifique se o backend está rodando (`curl http://localhost:4000/health`)
2. Confirme que o dispositivo está na mesma rede
3. Verifique firewalls/antivírus bloqueando a porta 4000
4. Use a `BackendTestActivity` para diagnóstico detalhado

### Se os limites ainda estiverem incorretos:
1. Verifique os logs para ver qual fonte está sendo usada
2. Confirme que o IMEI no app corresponde ao do banco
3. Teste diretamente na API: `curl http://localhost:4000/devices`

## Próximos Passos

1. **Testar em ambiente real** com dispositivos na mesma rede
2. **Monitorar logs** para identificar problemas de conexão
3. **Ajustar IPs** conforme a configuração de rede local
4. **Considerar** implementar descoberta automática de serviço

## Arquivos Modificados

- `UsageMonitorViewModel.kt` - atualizado para usar BackendClient
- `BackendClient.kt` - novo arquivo (criado)
- `BackendTestActivity.kt` - novo arquivo (criado)
- `activity_backend_test.xml` - novo layout (criado)
- `AndroidManifest.xml` - activity de teste adicionada

## Compatibilidade

A solução mantém compatibilidade total:
- Usa BackendClient primariamente
- Fallback para Turso se backend indisponível
- Nenhuma mudança breaking no código existente
