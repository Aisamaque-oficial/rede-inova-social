<?php
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

// Registra o menu
add_action( 'admin_menu', 'mtacess_add_admin_menu' );
function mtacess_add_admin_menu() {
    add_menu_page(
        'MTacess Configurações',
        'MTacess',
        'manage_options',
        'mtacess_settings',
        'mtacess_settings_page_html',
        'dashicons-universal-access-alt',
        100
    );
}

// Registra as configurações
add_action( 'admin_init', 'mtacess_settings_init' );
function mtacess_settings_init() {
    register_setting( 'mtacess_plugin_page', 'mtacess_license_key' );
    register_setting( 'mtacess_plugin_page', 'mtacess_primary_color' );
    register_setting( 'mtacess_plugin_page', 'mtacess_position' );

    add_settings_section(
        'mtacess_plugin_section',
        __( 'Configurações do Plugin', 'mtacess' ),
        'mtacess_settings_section_cb',
        'mtacess_plugin_page'
    );

    add_settings_field(
        'mtacess_license_key',
        __( 'Chave de Licença', 'mtacess' ),
        'mtacess_license_key_render',
        'mtacess_plugin_page',
        'mtacess_plugin_section'
    );

    add_settings_field(
        'mtacess_primary_color',
        __( 'Cor Principal (HEX)', 'mtacess' ),
        'mtacess_primary_color_render',
        'mtacess_plugin_page',
        'mtacess_plugin_section'
    );

    add_settings_field(
        'mtacess_position',
        __( 'Posição do Botão', 'mtacess' ),
        'mtacess_position_render',
        'mtacess_plugin_page',
        'mtacess_plugin_section'
    );
}

function mtacess_license_key_render() {
    $license = get_option( 'mtacess_license_key', '' );
    ?>
    <input type='text' name='mtacess_license_key' value='<?php echo esc_attr( $license ); ?>' class='regular-text'>
    <p class="description">Insira a chave de ativação recebida na compra.</p>
    <?php
}

function mtacess_primary_color_render() {
    $color = get_option( 'mtacess_primary_color', '#059669' );
    ?>
    <input type='color' name='mtacess_primary_color' value='<?php echo esc_attr( $color ); ?>'>
    <p class="description">Escolha a cor predominante do botão para combinar com o seu site.</p>
    <?php
}

function mtacess_position_render() {
    $position = get_option( 'mtacess_position', 'direita' );
    ?>
    <select name='mtacess_position'>
        <option value='direita' <?php selected( $position, 'direita' ); ?>>Canto Inferior Direito</option>
        <option value='esquerda' <?php selected( $position, 'esquerda' ); ?>>Canto Inferior Esquerdo</option>
    </select>
    <?php
}

function mtacess_settings_section_cb() {
    echo __( 'Preencha as informações abaixo para ativar o botão de acessibilidade.', 'mtacess' );
}

function mtacess_settings_page_html() {
    if ( ! current_user_can( 'manage_options' ) ) {
        return;
    }
    ?>
    <div class="wrap">
        <h1><?php echo esc_html( get_admin_page_title() ); ?></h1>
        <form action="options.php" method="post">
            <?php
            settings_fields( 'mtacess_plugin_page' );
            do_settings_sections( 'mtacess_plugin_page' );
            submit_button( 'Salvar Alterações' );
            ?>
        </form>
    </div>
    <?php
}
