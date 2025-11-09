export class ReportGenerator {
  constructor(database) {
    this.db = database;
  }

  /**
   * Gera um relatório de itens baseado no tipo e no usuário.
   * - Admins veem tudo.
   * - Users comuns só veem itens com valor <= 500.
   */
  generateHeader(reportType, user) {
    let header = "";
    if (reportType === "CSV") {
      header = "ID,NOME,VALOR,USUARIO\n";
    } else if (reportType === "HTML") {
      header = `<html><body>\n<h1>Relatório</h1>\n<h2>Usuário: ${user.name}</h2>\n<table>\n<tr><th>ID</th><th>Nome</th><th>Valor</th></tr>\n`;
    }
    return header;
  }

  generateFooter(reportType, total) {
    let footer = "";
    if (reportType === "CSV") {
      footer = `\nTotal,,\n${total},,\n`;
    } else if (reportType === "HTML") {
      footer = `</table>\n<h3>Total: ${total}</h3>\n</body></html>\n`;
    }
    return footer;
  }

  generateReport(reportType, user, items) {
    let report = "";
    let total = 0;

    // --- Seção do Corpo (Alta Complexidade) ---
    for (const item of items) {
      if (user.role === "ADMIN") {
        // Admins veem todos os itens
        if (item.value > 1000) {
          // Lógica bônus para admins
          item.priority = true;
        }

        if (reportType === "CSV") {
          report += `${item.id},${item.name},${item.value},${user.name}\n`;
          total += item.value;
        } else if (reportType === "HTML") {
          const style = item.priority ? 'style="font-weight:bold;"' : "";
          report += `<tr ${style}><td>${item.id}</td><td>${item.name}</td><td>${item.value}</td></tr>\n`;
          total += item.value;
        }
      } else if (user.role === "USER") {
        // Users comuns só veem itens de valor baixo
        if (item.value <= 500) {
          if (reportType === "CSV") {
            report += `${item.id},${item.name},${item.value},${user.name}\n`;
            total += item.value;
          } else if (reportType === "HTML") {
            report += `<tr><td>${item.id}</td><td>${item.name}</td><td>${item.value}</td></tr>\n`;
            total += item.value;
          }
        }
      }
    }
  }
}
