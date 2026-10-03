const plans = ['Básico', 'Essencial', 'Premium', 'VIP', 'Anual'];
const features = [
  { name: 'Registros de saúde', access: [true, true, true, true, true] },
  { name: 'Medicamentos', access: [true, true, true, true, true] },
  { name: 'Consultas', access: [false, true, true, true, true] },
  { name: 'Histórico e progresso', access: [false, false, true, true, true] },
  { name: 'Atividades físicas', access: [false, false, true, true, true] },
  { name: 'Relatórios de saúde', access: [false, false, false, true, true] },
  { name: 'Acompanhamento anual', access: [false, false, false, false, true] },
];

export default function Planos() {
  return (
    <section className="page-content">
      <div className="section-header">
        <div>
          <span className="eyebrow">CUIDA+</span>
          <h1>Planos</h1>
          <p className="page-description">Compare os recursos disponíveis em cada opção.</p>
        </div>
      </div>
      <div className="plan-table-scroll">
        <table className="plan-table">
          <thead>
            <tr>
              <th scope="col">Recursos</th>
              {plans.map((plan) => <th scope="col" key={plan} className={plan === 'Anual' ? 'annual-column' : ''}>{plan}</th>)}
            </tr>
          </thead>
          <tbody>
            {features.map((feature) => (
              <tr key={feature.name}>
                <th scope="row">{feature.name}</th>
                {feature.access.map((included, index) => (
                  <td key={plans[index]} className={plans[index] === 'Anual' ? 'annual-column' : ''}>
                    <span className={included ? 'plan-yes' : 'plan-no'} aria-label={included ? 'Disponível' : 'Não disponível'}>
                      {included ? '✓' : 'X'}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="page-description plan-note">Tabela comparativa ilustrativa. Valores, contratação e benefícios não estão configurados no sistema atual.</p>
    </section>
  );
}
