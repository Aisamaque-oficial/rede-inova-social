import { LucideIcon, Target, Compass, Zap, ShieldCheck, Megaphone, Accessibility, BarChart3, Users2, Network, BookOpen, Terminal, BarChart } from "lucide-react";

export interface Indicator {
    name: string;
    description: string;
    formula: string;
    periodicity: string;
}

export interface ObjectiveSection {
    title: string;
    nature?: {
        name: string;
        description: string;
        objectives: string[];
        typicalContents: string[];
    }[];
    content?: {
        objectives: string[];
        expectedResults: string[];
    };
    indicators?: Indicator[];
}

export interface SectorObjective {
    id: string;
    sectorId: string;
    title: string;
    description: string; 
    mission: string;
    tabs: {
        id: string;
        label: string;
        sections: ObjectiveSection[];
        isHighlighted?: boolean;
    }[];
    icon: any;
    color: string;
}

export const sectorObjectives: Record<string, SectorObjective> = {
    'ascom': {
        id: 'obj-ascom',
        sectorId: 'ascom',
        title: 'ASCOM e Difusão',
        mission: 'Popularizar a ciência e democratizar a informação através de uma comunicação estratégica e acessível.',
        description: 'Núcleo responsável pela imagem institucional e relacionamento com a sociedade.',
        tabs: [
            {
                id: 'tab-social',
                label: 'Redes Sociais',
                sections: [
                    {
                        title: 'Naturezas das Redes Sociais',
                        nature: [
                            {
                                name: 'Natureza 01: Institucional-Acadêmica',
                                description: 'Representação oficial do projeto, instituições parceiras e credibilidade científica.',
                                objectives: [
                                    'Divulgar resultados de pesquisa e extensão',
                                    'Dar visibilidade ao IF Baiano, UESB e parceiros',
                                    'Fortalecer a imagem institucional do projeto',
                                    'Prestar contas à sociedade e às agências de fomento',
                                    'Popularizar a ciência e a tecnologia',
                                    'Consolidar o projeto como referência regional e nacional'
                                ],
                                typicalContents: [
                                    'Lançamento e apresentação do projeto',
                                    'Oficinas, feiras e seminários',
                                    'Publicações científicas e relatórios',
                                    'Produção de materiais educativos',
                                    'Parcerias e resultados alcançados',
                                    'Atividades do Laboratório LISSA',
                                    'Impactos sociais e acadêmicos'
                                ]
                            },
                            {
                                name: 'Natureza 02: Ferramenta de Execução',
                                description: 'Canal operacional que mobiliza e implementa as ações no dia a dia.',
                                objectives: [
                                    'Engajar a comunidade e os parceiros',
                                    'Mobilizar participantes para eventos e formações',
                                    'Informar cronogramas e atividades',
                                    'Articular os setores envolvidos',
                                    'Apoiar a popularização da ciência nos territórios',
                                    'Dar transparência às ações em andamento'
                                ],
                                typicalContents: [
                                    'Convites para oficinas e feiras',
                                    'Avisos e chamadas públicas',
                                    'Cobertura em tempo real das atividades',
                                    'Bastidores e registros de campo',
                                    'Divulgação de materiais didáticos',
                                    'Interação com a comunidade'
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                id: 'tab-content',
                label: 'Conteúdos',
                sections: [
                    {
                        title: 'Objetivos e Resultados dos Conteúdos',
                        content: {
                            objectives: [
                                'Produzir conteúdos educativos, científicos e institucionais de alta qualidade.',
                                'Disseminar informações confiáveis e baseadas em evidências.',
                                'Garantir clareza, padronização e coerência na comunicação do projeto.',
                                'Incentivar a formação acadêmica e a difusão do conhecimento.',
                                'Assegurar a acessibilidade comunicacional em todos os materiais produzidos.',
                                'Valorizar a produção científica e extensionista da equipe.'
                            ],
                            expectedResults: [
                                'Publicação regular de conteúdos relevantes e alinhados ao planejamento estratégico.',
                                'Consolidação de um repositório institucional de materiais educativos e científicos.',
                                'Fortalecimento da imagem do projeto como referência em sua área de atuação.',
                                'Ampliação do acesso ao conhecimento por diferentes públicos.',
                                'Produção de materiais aptos para relatórios e prestação de contas.'
                            ]
                        }
                    }
                ]
            },
            {
                id: 'tab-internal',
                label: 'Diálogo Interno',
                sections: [
                    {
                        title: 'Objetivos e Resultados do Diálogo Interno do Setor',
                        content: {
                            objectives: [
                                'Garantir comunicação clara, eficiente e integrada entre os membros do setor.',
                                'Promover o alinhamento estratégico das atividades e responsabilidades.',
                                'Otimizar fluxos de trabalho e processos internos.',
                                'Estimular a colaboração, a transparência e o trabalho em equipe.',
                                'Monitorar prazos, metas e entregas institucionais.',
                                'Fortalecer a cultura organizacional e a governança do projeto.'
                            ],
                            expectedResults: [
                                'Redução de retrabalho e falhas de comunicação.',
                                'Maior eficiência e produtividade da equipe.',
                                'Cumprimento adequado de prazos e metas estabelecidas.',
                                'Melhor organização e acompanhamento das atividades.',
                                'Registro sistemático das decisões e ações do setor.'
                            ]
                        }
                    }
                ]
            },
            {
                id: 'tab-acess',
                label: 'Acessibilidade',
                sections: [
                    {
                        title: 'Objetivos e Resultados do Diálogo com a Acessibilidade',
                        content: {
                            objectives: [
                                'Garantir que todos os conteúdos e ações do projeto sejam acessíveis.',
                                'Integrar a acessibilidade ao planejamento desde a concepção das atividades.',
                                'Assegurar conformidade com as legislações e normas vigentes.',
                                'Promover a inclusão e a equidade comunicacional.',
                                'Fortalecer a produção de materiais acessíveis em Libras, audiodescrição e legendagem.',
                                'Consolidar a acessibilidade como princípio institucional.'
                            ],
                            expectedResults: [
                                'Disponibilização de conteúdos acessíveis em múltiplos formatos.',
                                'Ampliação do acesso de pessoas com deficiência às ações do projeto.',
                                'Integração efetiva entre os setores de comunicação e acessibilidade.',
                                'Melhoria na qualidade e na padronização dos materiais acessíveis.',
                                'Reconhecimento institucional pelas boas práticas inclusivas.'
                            ]
                        }
                    }
                ]
            },
            {
                id: 'tab-coord',
                label: 'Coordenação',
                sections: [
                    {
                        title: 'Objetivos e Resultados do Diálogo com a Coordenação e Acompanhamento do Projeto',
                        content: {
                            objectives: [
                                'Assegurar alinhamento estratégico entre a ASCOM e a coordenação do projeto.',
                                'Monitorar a execução das metas e indicadores institucionais.',
                                'Garantir transparência e prestação de contas.',
                                'Apoiar a tomada de decisões com base em dados e evidências.',
                                'Integrar ações de comunicação ao planejamento global do projeto.',
                                'Fortalecer a governança e a eficiência da gestão.'
                            ],
                            expectedResults: [
                                'Acompanhamento sistemático das atividades e entregas.',
                                'Relatórios institucionais consistentes e bem documentados.',
                                'Maior eficiência na gestão e no cumprimento dos objetivos do projeto.',
                                'Integração harmoniosa entre os setores envolvidos.',
                                'Suporte estratégico às ações de extensão, ensino e pesquisa.'
                            ]
                        }
                    }
                ]
            },
            {
                id: 'tab-indicators',
                label: 'Indicadores',
                isHighlighted: true,
                sections: [
                    {
                        title: '1. Indicadores – REDES SOCIAIS',
                        indicators: [
                            { name: 'Alcance Total', description: 'Número de pessoas impactadas pelas publicações', formula: 'Dados da plataforma', periodicity: 'Mensal' },
                            { name: 'Taxa de Engajamento', description: 'Interação do público com os conteúdos', formula: '(Curtidas + Comentários + Compartilhamentos + Salvamentos) ÷ Alcance × 100', periodicity: 'Mensal' },
                            { name: 'Crescimento de Seguidores', description: 'Evolução do público nas redes', formula: '(Seguidores Finais − Seguidores Iniciais) ÷ Seguidores Iniciais × 100', periodicity: 'Mensal' },
                            { name: 'Número de Publicações', description: 'Quantidade de posts realizados', formula: 'Total de publicações', periodicity: 'Mensal' },
                            { name: 'Impressões', description: 'Número total de visualizações', formula: 'Dados da plataforma', periodicity: 'Mensal' },
                            { name: 'Cliques em Links', description: 'Acessos aos conteúdos externos', formula: 'Total de cliques', periodicity: 'Mensal' },
                            { name: 'Taxa de Conversão', description: 'Participação em ações após divulgação', formula: 'Inscrições ou acessos ÷ Cliques × 100', periodicity: 'Trimestral' }
                        ]
                    },
                    {
                        title: '2. Indicadores – CONTEÚDOS',
                        indicators: [
                            { name: 'Conteúdos Produzidos', description: 'Quantidade de materiais desenvolvidos', formula: 'Total de conteúdos', periodicity: 'Mensal' },
                            { name: 'Conteúdos Publicados', description: 'Materiais efetivamente divulgados', formula: 'Total de publicações', periodicity: 'Mensal' },
                            { name: 'Taxa de Produtividade', description: 'Eficiência da produção', formula: 'Conteúdos Publicados ÷ Conteúdos Planejados × 100', periodicity: 'Mensal' },
                            { name: 'Conteúdos Acessíveis', description: 'Materiais adaptados para acessibilidade', formula: 'Conteúdos Acessíveis ÷ Total de Conteúdos × 100', periodicity: 'Mensal' },
                            { name: 'Tempo Médio de Produção', description: 'Tempo entre criação e publicação', formula: 'Soma dos prazos ÷ Total de conteúdos', periodicity: 'Mensal' },
                            { name: 'Materiais Científicos', description: 'Produções acadêmicas e técnicas', formula: 'Total de materiais científicos', periodicity: 'Semestral' },
                            { name: 'Índice de Qualidade', description: 'Avaliação dos conteúdos', formula: 'Média das avaliações', periodicity: 'Trimestral' }
                        ]
                    },
                    {
                        title: '3. Indicadores – DIÁLOGO INTERNO',
                        indicators: [
                            { name: 'Reuniões Realizadas', description: 'Encontros internos do setor', formula: 'Total de reuniões', periodicity: 'Mensal' },
                            { name: 'Taxa de Cumprimento de Prazos', description: 'Eficiência operacional', formula: 'Atividades Entregues no Prazo ÷ Total de Atividades × 100', periodicity: 'Mensal' },
                            { name: 'Tempo Médio de Resposta', description: 'Agilidade na comunicação interna', formula: 'Soma dos tempos de resposta ÷ Total de demandas', periodicity: 'Mensal' },
                            { name: 'Demandas Atendidas', description: 'Volume de solicitações concluídas', formula: 'Total de demandas', periodicity: 'Mensal' },
                            { name: 'Índice de Retrabalho', description: 'Necessidade de correções', formula: 'Demandas Refeitas ÷ Total de Demandas × 100', periodicity: 'Mensal' },
                            { name: 'Nível de Satisfação Interna', description: 'Avaliação da equipe', formula: 'Média das avaliações', periodicity: 'Trimestral' }
                        ]
                    },
                    {
                        title: '4. Indicadores – ACESSIBILIDADE',
                        indicators: [
                            { name: 'Conteúdos Acessibilizados', description: 'Materiais adaptados', formula: 'Total de conteúdos acessíveis', periodicity: 'Mensal' },
                            { name: 'Taxa de Acessibilidade', description: 'Proporção de materiais acessíveis', formula: 'Conteúdos Acessíveis ÷ Total de Conteúdos × 100', periodicity: 'Mensal' },
                            { name: 'Tempo de Acessibilização', description: 'Tempo médio de adaptação', formula: 'Soma dos prazos ÷ Total de conteúdos', periodicity: 'Mensal' },
                            { name: 'Solicitações Atendidas', description: 'Demandas de acessibilidade concluídas', formula: 'Total de solicitações', periodicity: 'Mensal' },
                            { name: 'Conformidade Normativa', description: 'Adequação às normas de acessibilidade', formula: 'Conteúdos Conformes ÷ Total de Conteúdos × 100', periodicity: 'Trimestral' },
                            { name: 'Recursos Produzidos', description: 'Libras, legendagem e audiodescrição', formula: 'Total de recursos', periodicity: 'Mensal' },
                            { name: 'Índice de Inclusão', description: 'Alcance do público com deficiência', formula: 'Avaliação qualitativa e quantitativa', periodicity: 'Semestral' }
                        ]
                    },
                    {
                        title: '5. Indicadores – COORDENAÇÃO',
                        indicators: [
                            { name: 'Metas Atingidas', description: 'Cumprimento do planejamento', formula: 'Metas Concluídas ÷ Metas Planejadas × 100', periodicity: 'Trimestral' },
                            { name: 'Entregas Realizadas', description: 'Produtos entregues à coordenação', formula: 'Total de entregas', periodicity: 'Mensal' },
                            { name: 'Taxa de Execução do Plano', description: 'Cumprimento das ações previstas', formula: 'Ações Executadas ÷ Ações Planejadas × 100', periodicity: 'Mensal' },
                            { name: 'Relatórios Emitidos', description: 'Documentos gerados para acompanhamento', formula: 'Total de relatórios', periodicity: 'Mensal' },
                            { name: 'Conformidade com o Cronograma', description: 'Aderência ao planejamento', formula: 'Entregas no Prazo ÷ Total de Entregas × 100', periodicity: 'Mensal' },
                            { name: 'Índice de Eficiência da Gestão', description: 'Desempenho global do setor', formula: 'Média dos indicadores estratégicos', periodicity: 'Trimestral' },
                            { name: 'Nível de Satisfação da Coordenação', description: 'Avaliação da coordenação', formula: 'Média das avaliações', periodicity: 'Semestral' }
                        ]
                    }
                ]
            }
        ],
        icon: Megaphone,
        color: 'blue'
    },
    'cgp': {
        id: 'obj-adm',
        sectorId: 'cgp',
        title: 'Coordenação Geral e Administração',
        mission: 'Garantir a governança, transparência e integridade administrativa de todas as ações e recursos públicos.',
        description: 'Setor responsável pela gestão estratégica, financeira e operacional do projeto.',
        tabs: [
            {
                id: 'tab-governanca',
                label: 'Diretrizes de Governança',
                sections: [
                    {
                        title: 'Governança e Célula de Comando',
                        content: {
                            objectives: [
                                'Assegurar a transparência absoluta na aplicação dos recursos.',
                                'Monitorar a integridade administrativa de todas as ações.',
                                'Garantir a conformidade com as normas das agências de fomento.',
                                'Facilitar a interlocução entre os diferentes núcleos do projeto.'
                            ],
                            expectedResults: [
                                '100% de transparência financeira e administrativa.',
                                'Relatórios executivos periódicos sem ressalvas.',
                                'Eficiência operacional e cumprimento integral das metas globais.'
                            ]
                        }
                    }
                ]
            },
            {
                id: 'tab-indicators',
                label: 'Indicadores',
                isHighlighted: true,
                sections: [
                    {
                        title: 'Indicadores de Governança',
                        indicators: [
                            { name: 'Índice de Transparência', description: 'Porcentagem de contas e processos públicos', formula: 'Processos Públicos ÷ Total × 100', periodicity: 'Mensal' },
                            { name: 'Execução Orçamentária', description: 'Uso dos recursos conforme o planejado', formula: 'Valor Executado ÷ Valor Previsto × 100', periodicity: 'Trimestral' },
                            { name: 'Eficiência de Gestão', description: 'Média de cumprimento de metas setoriais', formula: '∑ Metas Atingidas ÷ ∑ Metas Totais', periodicity: 'Mensal' }
                        ]
                    }
                ]
            }
        ],
        icon: ShieldCheck,
        color: 'slate'
    },
    'acessibilidade': {
        id: 'obj-acess',
        sectorId: 'acessibilidade',
        title: 'Acessibilidade Comunicacional',
        mission: 'Eliminar barreiras comunicacionais e garantir o direito à informação para todas as pessoas.',
        description: 'Setor transversal que atua na tradução e mediação de conteúdos para garantir inclusão plena.',
        tabs: [
            {
                id: 'geral',
                label: 'Diretrizes de Inclusão',
                sections: [
                    {
                        title: 'Ações de Acessibilidade',
                        content: {
                            objectives: [
                                'Prover tradução em Libras para todos os conteúdos audiovisuais.',
                                'Desenvolver roteiros de audiodescrição para peças gráficas e vídeos.',
                                'Garantir que a plataforma web siga padrões internacionais de acessibilidade.',
                                'Sensibilizar e capacitar a equipe interna para práticas inclusivas.'
                            ],
                            expectedResults: [
                                '100% dos materiais de difusão acessibilizados antes da publicação.',
                                'Plataforma digital com nível de conformidade Acessibilidade nota máxima.',
                                'Amplo acesso de pessoas com deficiência aos conteúdos do projeto.'
                            ]
                        }
                    }
                ]
            }
        ],
        icon: Accessibility,
        color: 'teal'
    },
    'plan': {
        id: 'obj-plan',
        sectorId: 'plan',
        title: 'Planejamento, Monitoramento e Avaliação',
        mission: 'Orientar o projeto através de evidências e métricas de impacto socioeconômico.',
        description: 'Unidade estratégica que analisa o progresso das metas e identifica gargalos operacionais.',
        tabs: [
            {
                id: 'geral',
                label: 'Gestão Estratégica',
                sections: [
                    {
                        title: 'Monitoramento e Avaliação',
                        content: {
                            objectives: [
                                'Monitorar os indicadores de desempenho (KPIs) em tempo real.',
                                'Avaliar o impacto direto das ações nos territórios atendidos.',
                                'Propor ajustes nos fluxos de trabalho para aumentar a produtividade.',
                                'Elaborar relatórios gerenciais para a coordenação geral.'
                            ],
                            expectedResults: [
                                'Metas estratégicas atingidas conforme o cronograma anual.',
                                'Dados precisos para fundamentar decisões de expansão.',
                                'Otimização constante dos processos internos.'
                            ]
                        }
                    }
                ]
            }
        ],
        icon: BarChart3,
        color: 'indigo'
    },
    'social': {
        id: 'obj-social',
        sectorId: 'social',
        title: 'Articulação Social e Territorial',
        mission: 'Fortalecer os vínculos comunitários e garantir o protagonismo social nos territórios.',
        description: 'Braço de campo que realiza a escuta qualificada e a mediação entre o projeto e a sociedade.',
        tabs: [
            {
                id: 'geral',
                label: 'Campo e Território',
                sections: [
                    {
                        title: 'Articulação Comunitária',
                        content: {
                            objectives: [
                                'Mapear e articular lideranças comunitárias nos territórios de atuação.',
                                'Realizar diagnósticos sociais participativos.',
                                'Facilitar a implementação de tecnologias sociais locais.',
                                'Garantir que as demandas da comunidade cheguem à coordenação.'
                            ],
                            expectedResults: [
                                'Rede de parceiros locais ativa e engajada.',
                                'Empoderamento das comunidades na resolução de problemas locais.',
                                'Alta adesão social às atividades propostas pelo projeto.'
                            ]
                        }
                    }
                ]
            }
        ],
        icon: Users2,
        color: 'orange'
    },
    'redes': {
        id: 'obj-redes',
        sectorId: 'redes',
        title: 'Parcerias Institucionais e Redes',
        mission: 'Conectar o projeto a ecossistemas de inovação e fortalecer a cooperação intersetorial.',
        description: 'Responsável pela prospecção de novos parceiros e manutenção da rede de cooperação.',
        tabs: [
            {
                id: 'geral',
                label: 'Conexões e Redes',
                sections: [
                    {
                        title: 'Cooperação Institucional',
                        content: {
                            objectives: [
                                'Prospectar convênios com universidades, ONGs e setor privado.',
                                'Articular a Rede Inova Social com outras redes de desenvolvimento regional.',
                                'Formalizar termos de cooperação técnica e financeira.',
                                'Promover intercâmbio de conhecimentos entre parceiros.'
                            ],
                            expectedResults: [
                                'Aumento do capital social e institucional do projeto.',
                                'Sustentabilidade financeira e técnica via parcerias.',
                                'Reconhecimento internacional do modelo de inovação social.'
                            ]
                        }
                    }
                ]
            }
        ],
        icon: Network,
        color: 'cyan'
    },
    'curadoria': {
        id: 'obj-curadoria',
        sectorId: 'curadoria',
        title: 'Produção Científica e Curadoria',
        mission: 'Transformar a prática social em conhecimento científico de alto impacto.',
        description: 'Núcleo acadêmico que coordena pesquisas, publicações e a curadoria de saberes científicos.',
        tabs: [
            {
                id: 'geral',
                label: 'Conhecimento e Ciência',
                sections: [
                    {
                        title: 'Curadoria Acadêmica',
                        content: {
                            objectives: [
                                'Sistematizar as experiências do projeto em artigos e publicações.',
                                'Curar conteúdos científicos para a plataforma digital.',
                                'Orientar a produção acadêmica ligada à Rede Inova Social.',
                                'Garantir o rigor metodológico em todas as frentes de pesquisa.'
                            ],
                            expectedResults: [
                                'Consolidação do projeto como referência acadêmica.',
                                'Publicações em periódicos de alta qualidade e eventos científicos.',
                                'Acervo digital científico rico e atualizado.'
                            ]
                        }
                    }
                ]
            }
        ],
        icon: BookOpen,
        color: 'emerald'
    },
    'tech': {
        id: 'obj-tech',
        sectorId: 'tech',
        title: 'Tecnologia, Plataforma e Dados',
        mission: 'Prover a infraestrutura tecnológica necessária para a inovação social digital.',
        description: 'Setor responsável pelo desenvolvimento da plataforma, segurança de dados e suporte tecnológico.',
        tabs: [
            {
                id: 'geral',
                label: 'Infraestrutura e Dados',
                sections: [
                    {
                        title: 'Desenvolvimento Tecnológico',
                        content: {
                            objectives: [
                                'Manter a plataforma Rede Inova ágil, segura e escalável.',
                                'Desenvolver novas funcionalidades baseadas nas necessidades dos setores.',
                                'Gerir o banco de dados e garantir a integridade da informação.',
                                'Suportar a infraestrutura de TI de todo o projeto.'
                            ],
                            expectedResults: [
                                'Disponibilidade total dos sistemas digitais.',
                                'Segurança da informação e proteção de dados (LGPD).',
                                'Ferramentas digitais que facilitam o trabalho de todos os membros.'
                            ]
                        }
                    }
                ]
            }
        ],
        icon: Terminal,
        color: 'violet'
    }
};
